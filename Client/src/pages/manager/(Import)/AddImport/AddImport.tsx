import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SupplierService, type SupplierDto } from "../../../../services/supplier.service";
import { ProductService, type ProductPreview } from "../../../../services/product.service";
import { ImportService } from "../../../../services/import.service";
import { AuthService } from "../../../../services/auth.service";
import { extractUserId } from "../../../../utils/user.utils";

type ImportDetailRow = {
  productId: number;
  productName: string;
  quantity: number;
  importPrice: number;
  totalPrice: number;
};

const formatDate = () => {
  const d = new Date();
  return d.toLocaleDateString("vi-VN");
};

export default function AddImport() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
  const [products, setProducts] = useState<ProductPreview[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [importDetails, setImportDetails] = useState<ImportDetailRow[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [creatorName, setCreatorName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const [suppliersData, productsData, me] = await Promise.all([
          SupplierService.fetchSuppliers(0, 100, { signal: controller.signal }),
          ProductService.fetchProductPreview(0, 100, { signal: controller.signal }),
          AuthService.me({ signal: controller.signal })
        ]);
        setSuppliers(suppliersData);
        setProducts(productsData);
        setCreatorName(me.fullName || "Current User");
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load data");
      }
    })();

    return () => controller.abort();
  }, []);

  const handleAddProduct = () => {
    if (!selectedProductId || quantity <= 0) {
      alert("Please select a product and enter a valid quantity");
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    // Check if product already added
    if (importDetails.some((d) => d.productId === selectedProductId)) {
      alert("Product already added to this import");
      return;
    }

    const newDetail: ImportDetailRow = {
      productId: product.id,
      productName: product.name,
      quantity,
      importPrice: product.price,
      totalPrice: product.price * quantity
    };

    setImportDetails([...importDetails, newDetail]);
    setSelectedProductId(null);
    setQuantity(1);
  };

  const handleRemoveProduct = (productId: number) => {
    setImportDetails(importDetails.filter((d) => d.productId !== productId));
  };

  const totalPrice = importDetails.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = async () => {
    if (!selectedSupplierId) {
      alert("Please select a supplier");
      return;
    }

    if (importDetails.length === 0) {
      alert("Please add at least one product");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const me = await AuthService.me();
      const staffId = extractUserId(me);

      // Create import form
      const createdImport = await ImportService.createImport({
        supplierId: selectedSupplierId,
        staffId: staffId || 0,
        dateCreated: new Date().toISOString(),
        totalPrice: totalPrice
      });

      // Add all import details
      for (const detail of importDetails) {
        await ImportService.addImportDetail(createdImport.id, {
          productId: detail.productId,
          quantity: detail.quantity
        });
      }

      alert("Import created successfully!");
      navigate(`/manager/import/${createdImport.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create import");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Add New Import</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/manager/import")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-blue-500 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Import"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Import Information */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Import Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-2">Supplier *</label>
            <select
              value={selectedSupplierId || ""}
              onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm text-slate-500">Creator</p>
            <p className="text-sm font-medium text-slate-700">{creatorName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Date Created</p>
            <p className="text-sm font-medium text-slate-700">{formatDate()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Price</p>
            <p className="text-sm font-medium text-slate-700">
              {totalPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
            </p>
          </div>
        </div>
      </section>

      {/* Add Product Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Add Products</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-slate-500 block mb-2">Product</label>
            <select
              value={selectedProductId || ""}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.price.toLocaleString("vi-VN")} VND (Stock:{" "}
                  {product.quantity})
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="text-sm text-slate-500 block mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
          >
            Add Product
          </button>
        </div>
      </section>

      {/* Products Table */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Import Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center">
            <thead>
              <tr className="bg-[#1279C3] text-white">
                <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">
                  Product Name
                </th>
                <th className="px-4 py-3 font-medium text-center align-middle">Quantity</th>
                <th className="px-4 py-3 font-medium text-center align-middle">Import Price</th>
                <th className="px-4 py-3 font-medium text-center align-middle">Subtotal</th>
                <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {importDetails.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No products added yet
                  </td>
                </tr>
              ) : (
                importDetails.map((item, index) => {
                  const bg =
                    index % 2 === 0
                      ? "bg-slate-50/60 border-b border-slate-100"
                      : "border-b border-slate-100";
                  return (
                    <tr key={item.productId} className={`${bg} text-center`}>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                        {item.productName}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-xs text-slate-700">
                        {item.importPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">
                        {item.totalPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <button
                          onClick={() => handleRemoveProduct(item.productId)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300">
                <td
                  colSpan={3}
                  className="px-4 py-3 text-sm font-semibold text-right text-slate-700"
                >
                  Total:
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-center text-slate-700">
                  {totalPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
