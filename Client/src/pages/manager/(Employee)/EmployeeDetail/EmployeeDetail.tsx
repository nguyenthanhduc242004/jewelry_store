import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEmployeeDetail } from "../../../../hooks/useEmployeeDetail";
import EmployeeProfile from "../../../../components/Employee/EmployeeProfile/EmployeeProfile";
import EmployeeProfileEdit from "../../../../components/Employee/EmployeeProfileEdit/EmployeeProfileEdit";
import { type Employee } from "../../../../components/Employee/EmployeeProfile/EmployeeProfile";
import { UserService } from "../../../../services/user.service";
import { OrderService, type OrderDto } from "../../../../services/order.service";
import { ImportService, type ImportDto } from "../../../../services/import.service";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
};

const getOrderStatusText = (status: string) => {
  if (status === "0") return "Pending";
  if (status === "1") return "Complete";
  if (status === "2") return "Reject";
  return status;
};

// initialEmployee removed, handled in hook

export default function EmployeeDetail() {
  const filterRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const { employee, loading, error } = useEmployeeDetail(id);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [imports, setImports] = useState<ImportDto[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [importsLoading, setImportsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    // Fetch orders completed or rejected by this employee
    (async () => {
      setOrdersLoading(true);
      try {
        const allOrders = await OrderService.fetchOrders(0, 500, { signal: controller.signal });
        const employeeOrders = allOrders.filter(
          (o) => o.staffId === Number(id) && (o.status === "1" || o.status === "2")
        );
        setOrders(employeeOrders);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to load employee orders:", err);
        }
      } finally {
        setOrdersLoading(false);
      }
    })();

    // Fetch imports created by this employee
    (async () => {
      setImportsLoading(true);
      try {
        const allImports = await ImportService.fetchImports(0, 500, { signal: controller.signal });
        const employeeImports = allImports.filter((i) => i.staffId === Number(id));
        setImports(employeeImports);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to load employee imports:", err);
        }
      } finally {
        setImportsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  // Reset password handler
  const handleResetPassword = async () => {
    if (!id) throw new Error("No employee ID");
    await UserService.resetPassword(Number(id), "12345678");
  };

  return (
    <div className="space-y-5 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 relative" ref={filterRef}>
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">
            Employee Information
          </h2>
        </div>
      </div>

      <section className="bg-white rounded-2xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <EmployeeProfile employee={employee} onResetPassword={handleResetPassword} />
        )}
      </section>

      {/* Orders Table */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Orders Processed</h3>
        {ordersLoading ? (
          <div className="text-center py-6 text-slate-400">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center">
              <thead>
                <tr className="bg-[#1279C3] text-white">
                  <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">
                    Order ID
                  </th>
                  <th className="px-4 py-3 font-medium text-center align-middle">Date</th>
                  <th className="px-4 py-3 font-medium text-center align-middle">Total</th>
                  <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No orders processed by this employee
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => {
                    const bg =
                      index % 2 === 0
                        ? "bg-slate-50/60 border-b border-slate-100"
                        : "border-b border-slate-100";
                    return (
                      <tr
                        key={order.id}
                        className={`${bg} text-center cursor-pointer hover:bg-blue-50 transition`}
                        onClick={() => navigate(`/manager/order/${order.id}`)}
                      >
                        <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                          OR{order.id.toString().padStart(4, "0")}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {formatDate(order.dateCreated)}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-700">
                          {order.totalPrice.toLocaleString("vi-VN")} VND
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <span
                            className={`px-2 py-1 rounded ${
                              order.status === "1"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {getOrderStatusText(order.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Imports Table */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Imports Created</h3>
        {importsLoading ? (
          <div className="text-center py-6 text-slate-400">Loading imports...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center">
              <thead>
                <tr className="bg-[#1279C3] text-white">
                  <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">
                    Import ID
                  </th>
                  <th className="px-4 py-3 font-medium text-center align-middle">Date Created</th>
                  <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {imports.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                      No imports created by this employee
                    </td>
                  </tr>
                ) : (
                  imports.map((importItem, index) => {
                    const bg =
                      index % 2 === 0
                        ? "bg-slate-50/60 border-b border-slate-100"
                        : "border-b border-slate-100";
                    return (
                      <tr
                        key={importItem.id}
                        className={`${bg} text-center cursor-pointer hover:bg-blue-50 transition`}
                        onClick={() => navigate(`/manager/import/${importItem.id}`)}
                      >
                        <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                          IM{importItem.id.toString().padStart(4, "0")}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {formatDate(importItem.dateCreated)}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-700">
                          {importItem.totalPrice.toLocaleString("vi-VN")} VND
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
