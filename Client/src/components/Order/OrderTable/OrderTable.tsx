import { displayOrDash } from "../../../utils/display";

export type OrderState = "0" | "1" | "2";

export type OrderRow = {
  order: string;
  customer: string;
  date: string;
  total: number;
  currency?: string;
  state: OrderState;
};

type OrderTableProps = {
  rows: OrderRow[];
  onRowClick?: (row: OrderRow) => void;
};

export default function OrderTable({ rows, onRowClick }: OrderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-center">
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

            // Map numeric state to icon and border
            if (row.state == "0") {
              stateIcon = "/img/loading.png"; // pending
              stateBorder = "border-[#1279C3]";
            } else if (row.state == "1") {
              stateIcon = "/img/success.png"; // completed
              stateBorder = "border-[#2ECC71]";
            } else {
              stateIcon = "/img/failed.png"; // rejected
              stateBorder = "border-[#E74C3C]";
            }

            return (
              <tr
                key={row.order}
                className={`${bg} text-center cursor-pointer hover:bg-blue-50 transition`}
                onClick={() => onRowClick?.(row)}
              >
                <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-center align-middle">
                  {row.order}
                </td>
                <td className="px-4 py-3 text-xs text-slate-700">{displayOrDash(row.customer)}</td>
                <td className="px-4 py-3 text-xs text-slate-700">{displayOrDash(row.date)}</td>
                <td className="px-4 py-3 text-xs text-slate-700">
                  {row.total.toLocaleString("vi-VN", { maximumFractionDigits: 0 })}{" "}
                  {row.currency ?? "VND"}
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
  );
}
