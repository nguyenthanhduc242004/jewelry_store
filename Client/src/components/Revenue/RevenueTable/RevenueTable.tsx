export type RevenueRow = {
  id: string;
  content: string;
  date: string;
  total: number;
  currency?: string;
  type: "income" | "expense";
};

type RevenueTableProps = {
  rows: RevenueRow[];
};

export default function RevenueTable({ rows }: RevenueTableProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-center text-sm">
        <thead>
          <tr className="bg-[#1279C3] text-white">
            <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">ID</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Content</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Date</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Total</th>
            <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">Actions</th>
          </tr>
        </thead>

          <tbody>
            {rows.map((row, index) => {
              const isIncome = row.type === "income";
              const sign = isIncome ? "+" : "-";
              const bg =
                index % 2 === 0
                  ? "bg-slate-50/60 border-b border-slate-100"
                  : "border-b border-slate-100";

              return (
                <tr key={row.id} className={`${bg} text-center`}>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-left">
                    {row.id}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{row.content}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{row.date}</td>
                  <td className={`px-4 py-3 text-xs text-center text-black`}>
                    {sign}
                    {row.total.toLocaleString("vi-VN")} {row.currency ?? "VND"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition">
                      View
                    </button>
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
