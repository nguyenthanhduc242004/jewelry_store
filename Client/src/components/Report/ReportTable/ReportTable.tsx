export type ReportRow = {
  id: string;
  content: string;
  date: string;
  total: number;
  currency?: string;
  type: "income" | "expense";
};

type ReportTableProps = {
  rows: ReportRow[];
};

export default function ReportTable({ rows }: ReportTableProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Income and expenses</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-center text-sm">
        <thead>
          <tr className="bg-[#1279C3] text-white">
            <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">ID</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Content</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Date</th>
            <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">Total</th>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
