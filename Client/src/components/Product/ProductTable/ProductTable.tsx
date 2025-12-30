export type ProductRow = {
  productId: number;
  id: string;
  name: string;
  subtitle?: string;
  imageUrl: string;
  category: string;
  price: number;
  quantity: number;
  currency?: string;
};

type ProductTableProps = {
  rows: ProductRow[];
  onRowClick?: (row: ProductRow) => void;
};

import { displayOrDash } from "../../../utils/display";
export default function ProductTable({ rows, onRowClick }: ProductTableProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#1279C3] text-white">
              <th className="px-4 py-3 rounded-l-xl font-medium text-center">ID</th>
              <th className="px-4 py-3 font-medium text-center">Name</th>
              <th className="px-4 py-3 font-medium text-center">Image</th>
              <th className="px-4 py-3 font-medium text-center">Category</th>
              <th className="px-4 py-3 font-medium text-center">Price</th>
              <th className="px-4 py-3 rounded-r-xl font-medium text-center">Quantity</th>
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
                  className={`${bg} cursor-pointer hover:bg-blue-50 transition`}
                  onClick={() => onRowClick?.(row)}
                >
                  {/* ID */}
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700 text-center">
                    {row.id}
                  </td>

                  {/* Name + subtitle */}
                  <td className="px-4 py-3 text-xs text-slate-700 text-left">
                    <div className="font-semibold text-sm">{displayOrDash(row.name)}</div>
                    {row.subtitle && (
                      <div className="text-[11px] text-slate-500">
                        {displayOrDash(row.subtitle)}
                      </div>
                    )}
                  </td>

                  {/* Image */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <img
                        src={row.imageUrl}
                        alt={row.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-xs text-slate-600 text-center">
                    {displayOrDash(row.category)}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-xs text-slate-700 text-right">
                    {row.price.toLocaleString("vi-VN", { maximumFractionDigits: 0 })}{" "}
                    {row.currency ?? "VND"}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3 text-xs text-slate-700 text-center rounded-r-xl">
                    {row.quantity}
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
