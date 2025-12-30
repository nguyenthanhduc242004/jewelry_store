import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PriceFilterPopup from "../../../../components/common/PriceFilterPopup/PriceFilterPopup";
import ProductTable, {
  type ProductRow
} from "../../../../components/Product/ProductTable/ProductTable";
import { ProductService } from "../../../../services";
import { exportToPDF } from "../../../../utils/pdfExport";

let productCache: ProductRow[] = [];

export default function Product() {
  const navigate = useNavigate();
  const [isDateOpen, setIsDateOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [rows, setRows] = useState<ProductRow[]>(productCache);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxProductPrice, setMaxProductPrice] = useState(10_000_000);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(10_000_000);
  const [appliedCategory, setAppliedCategory] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(10_000_000);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await ProductService.fetchProductPreview(0, 100, {
          signal: controller.signal
        });
        const mapped: ProductRow[] = data.map((p) => ({
          productId: p.id,
          id: `PR${p.id.toString().padStart(4, "0")}`,
          name: p.name,
          subtitle: p.material,
          imageUrl: p.imageUrl || "/img/placeholder.png",
          category: p.categoryName,
          price: p.price,
          quantity: p.quantity,
          currency: "VND"
        }));
        productCache = mapped;
        setRows(mapped);

        // Calculate max price
        const maxPrice = mapped.reduce((max, p) => Math.max(max, p.price), 0);
        setMaxProductPrice(maxPrice);
        setFilterMaxPrice(maxPrice);
        setAppliedMaxPrice(maxPrice);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load products");
      }
    };
    load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // CLICK 1 DÒNG PRODUCT → TRANG DETAIL
  const handleViewProduct = (row: ProductRow) => {
    navigate(`/manager/product/${row.productId}`);
  };

  // CLICK NÚT ADD NEW PRODUCT
  const handleAddNew = () => {
    navigate("/manager/product/add");
  };

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let filtered = rows;

    // Apply search term
    if (term) {
      filtered = filtered.filter((row) =>
        [row.name, row.category]
          .filter(Boolean)
          .some((value) => value!.toString().toLowerCase().includes(term))
      );
    }

    // Apply category filter
    if (appliedCategory) {
      filtered = filtered.filter((row) => row.category === appliedCategory);
    }

    // Apply price range filter
    filtered = filtered.filter(
      (row) => row.price >= appliedMinPrice && row.price <= appliedMaxPrice
    );

    return filtered;
  }, [rows, searchTerm, appliedCategory, appliedMinPrice, appliedMaxPrice]);

  const handleApplyFilter = () => {
    setAppliedCategory(filterCategory);
    setAppliedMinPrice(filterMinPrice);
    setAppliedMaxPrice(filterMaxPrice);
    setIsDateOpen(false);
  };

  const handleExport = async () => {
    await exportToPDF({
      title: "Product List",
      columns: [
        { header: "ID", dataKey: "id", width: 25 },
        { header: "Name", dataKey: "name", width: 60 },
        { header: "Category", dataKey: "category", width: 35 },
        { header: "Price (VND)", dataKey: "price", width: 35 },
        { header: "Quantity", dataKey: "quantity", width: 25 }
      ],
      data: filteredRows,
      filename: `products-${Date.now()}.pdf`,
      orientation: "portrait"
    });
  };

  return (
    <div className="space-y-5 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 relative" ref={filterRef}>
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Product</h2>
          <button
            type="button"
            onClick={() => setIsDateOpen((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 text-xs hover:bg-slate-50 transition"
          >
            ☰
          </button>

          {/* Popup price-range */}
          <PriceFilterPopup
            isOpen={isDateOpen}
            className="top-1 left-20"
            minPrice={filterMinPrice}
            maxPrice={filterMaxPrice}
            maxLimit={maxProductPrice}
            category={filterCategory}
            onMinPriceChange={setFilterMinPrice}
            onMaxPriceChange={setFilterMaxPrice}
            onCategoryChange={setFilterCategory}
            onApply={handleApplyFilter}
          />
        </div>

        <div className="flex-1 min-w-[240px] max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or category"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            Add new product
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition ml-3"
          >
            Export
          </button>
        </div>
      </div>
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        {error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : (
          <ProductTable rows={filteredRows} onRowClick={handleViewProduct} />
        )}
      </section>
    </div>
  );
}
