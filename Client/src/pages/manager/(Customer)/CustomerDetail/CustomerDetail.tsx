import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CustomerInfo from "../../../../components/Customer/CustomerInfo/CustomerInfo";
import CustomerPurchaseTable, {
  type CustomerPurchaseRow
} from "../../../../components/Customer/CustomerInfo/CustomerPurchase";
import { useCustomerDetail } from "../../../../hooks/useCustomerDetail";
import { OrderService } from "../../../../services/order.service";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
};

const toState = (status?: string) => {
  const s = (status ?? "").trim();
  if (s === "1") return "success" as const;
  if (s === "0") return "pending" as const;
  if (s === "2") return "failed" as const;
  // Legacy string-based status
  const lower = s.toLowerCase();
  if (lower.includes("hoàn") || lower.includes("thành") || lower.includes("complete"))
    return "success" as const;
  if (lower.includes("chờ") || lower.includes("pending")) return "pending" as const;
  return "failed" as const;
};

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { customer, loading, error } = useCustomerDetail(id);
  const [orders, setOrders] = useState<CustomerPurchaseRow[]>([]);
  const [orderError, setOrderError] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    (async () => {
      try {
        const data = await OrderService.fetchOrders(0, 200, { signal: controller.signal });
        const filtered = data.filter((o) => o.userId === Number(id));
        const mapped: CustomerPurchaseRow[] = filtered.map((o) => ({
          order: `OR${o.id.toString().padStart(4, "0")}`,
          orderId: o.id,
          customer: customer?.name ?? "",
          date: formatDate(o.dateCreated),
          total: o.totalPrice,
          currency: "VND",
          state: toState(o.status)
        }));
        setOrders(mapped);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setOrderError(err instanceof Error ? err.message : "Failed to load purchase history");
      }
    })();
    return () => controller.abort();
  }, [id, customer?.name]);

  if (loading) {
    return (
      <div className="space-y-5 mt-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 relative">
            <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">
              Customer Information
            </h2>
          </div>
        </div>
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center py-8 text-slate-500">Loading customer information...</div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5 mt-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 relative">
            <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">
              Customer Information
            </h2>
          </div>
        </div>
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5 mt-3">
      {/* Hàng tiêu đề + nút */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 relative" ref={filterRef}>
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">
            Customer Information
          </h2>
        </div>
      </div>
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <CustomerInfo customer={customer} />

        {orderError ? (
          <div className="text-center py-6 text-red-500 text-sm">{orderError}</div>
        ) : (
          <CustomerPurchaseTable rows={orders} />
        )}
      </section>
    </div>
  );
}
