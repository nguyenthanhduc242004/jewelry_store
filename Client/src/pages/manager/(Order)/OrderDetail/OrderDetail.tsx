import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { OrderService } from "../../../../services/order.service";
import { UserService } from "../../../../services/user.service";
import { AuthService } from "../../../../services/auth.service";
import { extractUserId } from "../../../../utils/user.utils";
import type { OrderDto, OrderDetailDto } from "../../../../services/order.service";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
};

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailDto[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [staffName, setStaffName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const [orderData, detailsData] = await Promise.all([
          OrderService.fetchOrderById(Number(id), { signal: controller.signal }),
          OrderService.fetchOrderDetails(Number(id), { signal: controller.signal })
        ]);
        setOrder(orderData);
        setOrderDetails(detailsData);

        // Fetch customer name
        if (orderData.userId) {
          try {
            const user = await UserService.getUserById(orderData.userId, {
              signal: controller.signal
            });
            setCustomerName(user.fullName || `User #${orderData.userId}`);
          } catch {
            setCustomerName(`User #${orderData.userId}`);
          }
        }

        // Fetch staff name if order is completed or rejected
        if (orderData.staffId && orderData.status !== "0") {
          try {
            const staff = await UserService.getUserById(orderData.staffId, {
              signal: controller.signal
            });
            setStaffName(staff.fullName || `Staff #${orderData.staffId}`);
          } catch {
            setStaffName(`Staff #${orderData.staffId}`);
          }
        }
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5 mt-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Order Details</h2>
          </div>
        </div>
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center py-8 text-slate-500">Loading order details...</div>
        </section>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-5 mt-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Order Details</h2>
          </div>
        </div>
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center py-8 text-red-500">Error: {error || "Order not found"}</div>
        </section>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    if (status === "0") return "Pending";
    if (status === "1") return "Complete";
    if (status === "2") return "Reject";
    return status;
  };

  const handleComplete = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      const me = await AuthService.me();
      const staffId = extractUserId(me);
      if (staffId) {
        await OrderService.completeOrder(order.id, { staffId });
      } else {
        await OrderService.completeOrder(order.id, { staffId: 0 });
      }
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to complete order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!order) return;
    setActionLoading(true);
    try {
      const me = await AuthService.me();
      const staffId = extractUserId(me);
      if (staffId) {
        await OrderService.rejectOrder(order.id, { staffId });
      } else {
        await OrderService.rejectOrder(order.id, { staffId: 0 });
      }
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject order");
    } finally {
      setActionLoading(false);
    }
  };

  const subtotal = orderDetails.reduce((sum, item) => sum + item.priceAtSale * item.quantity, 0);

  return (
    <div className="space-y-5 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Order details</h2>
        </div>
      </div>

      {/* Order Information */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Order Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Order ID</p>
            <p className="text-sm font-medium text-slate-700">
              OR{order.id.toString().padStart(4, "0")}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Date Created</p>
            <p className="text-sm font-medium text-slate-700">{formatDate(order.dateCreated)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Customer Name</p>
            <p className="text-sm font-medium text-slate-700">{customerName || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className="text-sm font-medium text-slate-700">{getStatusText(order.status)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Phone Number</p>
            <p className="text-sm font-medium text-slate-700">{order.phoneNumber || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Price</p>
            <p className="text-sm font-medium text-slate-700">
              {order.totalPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Shipping Address</p>
            <p className="text-sm font-medium text-slate-700">{order.shippingAddress || "—"}</p>
          </div>
          <div>
            {/* Action buttons or staff info as 4th field in right column */}
            {order.status === "0" ? (
              <div className="flex gap-3">
                <button
                  onClick={handleComplete}
                  disabled={actionLoading}
                  className="rounded-md border border-green-300 px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "Processing..." : "Complete"}
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="rounded-md border border-[#FACDC3] px-3 py-1 text-sm font-medium text-[#EB2F06] hover:bg-[#FACDC3]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "Processing..." : "Reject"}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-500">
                  {order.status === "1" ? "Completed by" : "Rejected by"}
                </p>
                <p className="text-sm font-medium text-slate-700">{staffName || "—"}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Order Items */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center">
            <thead>
              <tr className="bg-[#1279C3] text-white">
                <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">
                  Product ID
                </th>
                <th className="px-4 py-3 font-medium text-center align-middle">Quantity</th>
                <th className="px-4 py-3 font-medium text-center align-middle">Price at Sale</th>
                <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No items in this order
                  </td>
                </tr>
              ) : (
                orderDetails.map((item, index) => {
                  const bg =
                    index % 2 === 0
                      ? "bg-slate-50/60 border-b border-slate-100"
                      : "border-b border-slate-100";
                  return (
                    <tr
                      key={`${item.orderId}-${item.productId}`}
                      className={`${bg} text-center cursor-pointer hover:bg-blue-50 transition`}
                      onClick={() => navigate(`/manager/product/${item.productId}`)}
                    >
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                        PRD{item.productId.toString().padStart(3, "0")}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-xs text-slate-700">
                        {item.priceAtSale.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">
                        {(item.priceAtSale * item.quantity).toLocaleString("vi-VN", {
                          maximumFractionDigits: 0
                        })}{" "}
                        VND
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
                  {subtotal.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
