import { useNavigate } from "react-router-dom";

export type CustomerPurchaseRow = {
  order: string;
  orderId?: number;
  customer: string;
  date: string;
  total: number;
  currency?: string;
  state: "pending" | "success" | "failed";
};

type CustomerPurchaseProps = {
  rows: CustomerPurchaseRow[];
};

export default function CustomerPurchaseTable({ rows }: CustomerPurchaseProps) {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-[#1279C3]">Purchase History</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-center text-sm">
          <thead>
            <tr className="bg-[#1279C3] text-white">
              <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">ID</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Customer</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Date</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Total</th>
              <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">State</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const bg =
                index % 2 === 0
                  ? "bg-slate-50/60 border-b border-slate-100"
                  : "border-b border-slate-100";

              let stateIcon = "";
              let stateBorder = "";

              if (row.state === "pending") {
                stateIcon = "/img/loading.png";
                stateBorder = "border-[#1279C3]";
              } else if (row.state === "success") {
                stateIcon = "/img/success.png";
                stateBorder = "border-[#2ECC71]";
              } else {
                stateIcon = "/img/failed.png";
                stateBorder = "border-[#E74C3C]";
              }

              return (
                <tr
                  key={row.order}
                  className={`${bg} text-center cursor-pointer hover:bg-blue-50 transition`}
                  onClick={() => row.orderId && navigate(`/manager/order/${row.orderId}`)}
                >
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-left">
                    {row.order}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{row.customer}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{row.date}</td>
                  <td className="px-4 py-3 text-xs text-center text-black">
                    {row.total.toLocaleString("vi-VN")} {row.currency ?? "VND"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div
                      className={`inline-flex h-8 w-10 items-center justify-center rounded-md border ${stateBorder}`}
                    >
                      <img src={stateIcon} alt={row.state} className="h-5 w-5 object-contain" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
