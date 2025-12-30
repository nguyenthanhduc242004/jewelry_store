export type LiquidationProductRow = {
  no: number;
  name: string;
  subtitle?: string;
  imageUrl: string;
  category: string;
  price: number;
  quantity: number;
  totalPrice: number;
  currency?: string;
};

type LiquidationProductTableProps = {
  rows: LiquidationProductRow[];
};

export default function LiquidationProductTable({ rows }: LiquidationProductTableProps) {
  const grandTotal = rows.reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="mt-4">
      {/* Total ở góc phải */}
      <div className="mb-1 text-right text-xs text-slate-600">
        Total: {grandTotal.toLocaleString("vi-VN")} VND
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-center">
        <thead>
          <tr className="bg-[#1279C3] text-white">
            <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">
              NO.
            </th>
            <th className="px-4 py-3 font-medium text-center align-middle">Product</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Image</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Category</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Price</th>
            <th className="px-4 py-3 font-medium text-center align-middle">Quantity</th>
            <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">
              Total price
            </th>
          </tr>
        </thead>

          <tbody>
            {rows.map((row, index) => {
              const bg =
                index % 2 === 0
                  ? "bg-slate-50/60 border-b border-slate-100"
                  : "border-b border-slate-100";

              return (
                <tr key={row.no} className={`${bg} text-center`}>
                  {/* NO */}
                  <td className="px-4 py-3 text-xs text-slate-700 text-left">
                    {row.no}
                  </td>

                  {/* Product */}
                  <td className="px-4 py-3 text-xs text-slate-700">
                    <div className="font-semibold text-sm">{row.name}</div>
                    {row.subtitle && (
                      <div className="text-[11px] text-slate-500">
                        {row.subtitle}
                      </div>
                    )}
                  </td>

                  {/* Image */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <img
                        src={row.imageUrl}
                        alt={row.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {row.category}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-xs text-slate-700">
                    {row.price.toLocaleString("vi-VN")} {row.currency ?? "VND"}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3 text-xs text-slate-700">
                    {row.quantity}
                  </td>

                  {/* Total price */}
                  <td className="px-4 py-3 text-xs text-slate-700">
                    {row.totalPrice.toLocaleString("vi-VN")}{" "}
                    {row.currency ?? "VND"}
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
