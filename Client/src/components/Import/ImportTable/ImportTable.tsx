export type ImportRow = {
  id: string;
  supplier: string;
  date: string;
  total: number;
  currency?: string;
  creator?: string;
};

type ImportTableProps = {
  rows: ImportRow[];
  onRowClick?: (row: ImportRow) => void;
};

export default function ImportTable({ rows, onRowClick }: ImportTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-center">
        <thead>
          <tr className="bg-[#1279C3] text-white">
            <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">ID</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Supplier</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Date</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Total</th>
            <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">Creator</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => {
            const bg =
              index % 2 === 0
                ? "bg-slate-50/60 border-b border-slate-100"
                : "border-b border-slate-100";

            return (
              <tr
                key={row.id}
                className={`${bg} text-center cursor-pointer hover:bg-blue-50 transition`}
                onClick={() => onRowClick?.(row)}
              >
                {/* ID */}
                <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-center align-middle">
                  {row.id}
                </td>

                {/* Supplier */}
                <td className="px-4 py-3 text-xs text-slate-700">{row.supplier}</td>

                {/* Date */}
                <td className="px-4 py-3 text-xs text-slate-700">{row.date}</td>

                {/* Total */}
                <td className="px-4 py-3 text-xs text-slate-700">
                  {row.total.toLocaleString("vi-VN", { maximumFractionDigits: 0 })}{" "}
                  {row.currency ?? "VND"}
                </td>

                {/* Creator */}
                <td className="px-4 py-3 text-xs text-slate-700">{row.creator}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
