import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePriceFilterPopup from "../../../../components/common/DatePriceFilterPopup/DatePriceFilterPopup";
import OrderTable, { type OrderRow } from "../../../../components/Order/OrderTable/OrderTable";
import { OrderService } from "../../../../services/order.service";
import { exportToPDF } from "../../../../utils/pdfExport";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
};

const toState = (status?: string): "0" | "1" | "2" => {
  // Map status: "0" = pending, "1" = completed, "2" = rejected
  if (status === "1") return "1";
  if (status === "2") return "2";
  return "0"; // default to pending
};

let orderCache: OrderRow[] = [];

export default function Order() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<OrderRow[]>(orderCache);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [maxOrderPrice, setMaxOrderPrice] = useState(100_000_000);

  // Filter states
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(100_000_000);

  // Applied filters
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(100_000_000);

  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const data = await OrderService.fetchOrderSummary(0, 100, { signal: controller.signal });
        const mapped: OrderRow[] = data.map((o) => ({
          order: `OR${o.id.toString().padStart(4, "0")}`,
          customer: o.customerName || "",
          date: formatDate(o.dateCreated),
          total: o.totalPrice,
          currency: "VND",
          state: toState(o.status)
        }));
        orderCache = mapped;
        setRows(mapped);

        // Calculate max price
        const maxPrice = mapped.reduce((max, o) => Math.max(max, o.total), 0);
        setMaxOrderPrice(maxPrice);
        setFilterMaxPrice(maxPrice);
        setAppliedMaxPrice(maxPrice);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load orders");
      }
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handler to extract numeric order ID from formatted order string (e.g., "OR0001" -> "1")
  const handleRowClick = (row: OrderRow) => {
    const numericId = parseInt(row.order.replace(/\D/g, ""), 10);
    navigate(`/manager/order/${numericId}`);
  };

  const handleApplyFilter = () => {
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
    setAppliedMinPrice(filterMinPrice);
    setAppliedMaxPrice(filterMaxPrice);
    setIsFilterOpen(false);
  };

  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Apply date range filter
    if (appliedFromDate) {
      const fromDate = new Date(appliedFromDate);
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.date.split("/").reverse().join("-"));
        return rowDate >= fromDate;
      });
    }

    if (appliedToDate) {
      const toDate = new Date(appliedToDate);
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.date.split("/").reverse().join("-"));
        return rowDate <= toDate;
      });
    }

    // Apply price range filter
    filtered = filtered.filter(
      (row) => row.total >= appliedMinPrice && row.total <= appliedMaxPrice
    );

    return filtered;
  }, [rows, appliedFromDate, appliedToDate, appliedMinPrice, appliedMaxPrice]);

  const handleExport = async () => {
    const stateMap = { "0": "Pending", "1": "Completed", "2": "Rejected" };
    await exportToPDF({
      title: "Order List",
      columns: [
        { header: "Order ID", dataKey: "order", width: 30 },
        { header: "Customer", dataKey: "customer", width: 50 },
        { header: "Date", dataKey: "date", width: 35 },
        { header: "Total (VND)", dataKey: "total", width: 35 },
        { header: "Status", dataKey: "stateText", width: 30 }
      ],
      data: filteredRows.map((row) => ({
        ...row,
        stateText: stateMap[row.state] || row.state
      })),
      filename: `orders-${Date.now()}.pdf`,
      orientation: "portrait"
    });
  };

  return (
    <div className="space-y-5 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 relative" ref={filterRef}>
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Order</h2>
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 text-xs hover:bg-slate-50 transition"
          >
            ☰
          </button>

          <DatePriceFilterPopup
            isOpen={isFilterOpen}
            className="top-1 left-20"
            fromDate={filterFromDate}
            toDate={filterToDate}
            minPrice={filterMinPrice}
            maxPrice={filterMaxPrice}
            maxLimit={maxOrderPrice}
            onFromDateChange={setFilterFromDate}
            onToDateChange={setFilterToDate}
            onMinPriceChange={setFilterMinPrice}
            onMaxPriceChange={setFilterMaxPrice}
            onApply={handleApplyFilter}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate("/manager/order/add")}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            Add new order
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            Export
          </button>
        </div>
      </div>
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        {error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <OrderTable rows={filteredRows} onRowClick={handleRowClick} />
        )}
      </section>
    </div>
  );
}
