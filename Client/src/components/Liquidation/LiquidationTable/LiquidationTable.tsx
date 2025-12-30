export type LiquidationState = "pending" | "success" | "failed";

export type LiquidationRow = {
  id: string;
  creator: string;
  date: string;
  state: LiquidationState;
};

type LiquidationTableProps = {
  rows: LiquidationRow[];
  onView?: (row: LiquidationRow) => void;
};

export default function LiquidationTable({ rows, onView }: LiquidationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-center">
        <thead>
          <tr className="bg-[#1279C3] text-white">
            <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">ID</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Date</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Creator</th>
            <th className="px-4 py-3 font-medium text-center align-middle">State</th>
            <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">Actions</th>
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
              <tr key={row.id} className={`${bg} text-center`}>
                <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-left">
                  {row.id}
                </td>

                <td className="px-4 py-3 text-xs text-slate-700">{row.date}</td>

                <td className="px-4 py-3 text-xs text-slate-700">{row.creator}</td>

                <td className="px-4 py-3 text-xs">
                  <div
                    className={`inline-flex h-8 w-10 items-center justify-center rounded-md border ${stateBorder}`}
                  >
                    <img src={stateIcon} alt={row.state} className="h-5 w-5 object-contain" />
                  </div>
                </td>

                <td className="px-4 py-3">
                  <button
                    className="rounded-md border border-[#DDE4F0] px-5 py-1 text-xs font-medium text-[#1279C3] hover:bg-[#1279C3]/5"
                    onClick={() => onView?.(row)}
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
