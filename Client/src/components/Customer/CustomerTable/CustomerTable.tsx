export type CustomerRow = {
  id: number;
  name: string;
  imageUrl?: string;
  address: string;
  phone: string;
  email: string;
};

type CustomerTableProps = {
  rows: CustomerRow[];
  onView?: (row: CustomerRow) => void;
};

export default function CustomerTable({ rows, onView }: CustomerTableProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center">
          <thead>
            <tr className="bg-[#1279C3] text-white">
              <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">Name</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Photo</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Address</th>
              <th className="px-4 py-3 font-medium text-center align-middle">Phone</th>
              <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">Email</th>
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
                  onClick={() => onView?.(row)}
                >
                  {/* Name */}
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-left">
                    {row.name}
                  </td>

                  {/* Photo */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <img
                        src={row.imageUrl}
                        alt={row.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </div>
                  </td>

                  {/* Address */}
                  <td className="px-4 py-3 text-xs text-slate-700">{row.address}</td>

                  {/* Phone */}
                  <td className="px-4 py-3 text-xs text-slate-700">{row.phone}</td>

                  {/* Email */}
                  <td className="px-4 py-3 text-xs text-slate-700">{row.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
