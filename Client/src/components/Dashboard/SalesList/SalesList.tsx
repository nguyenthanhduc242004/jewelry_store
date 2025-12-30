type Product = {
  productName: string;
  quantity: number;
};

type SalesListProps = {
  products: Product[];
};

export default function SalesList({ products }: SalesListProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold text-lg">Top 5 Products</h3>
      <p className="text-xs text-gray-400 mb-4">Most bought products</p>

      {products.length === 0 ? (
        <p className="text-sm text-gray-500">No data available</p>
      ) : (
        products.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-3">
            <span className="font-medium">{item.productName}</span>
            <span className="text-gray-600 text-sm">QTY: {item.quantity}</span>
          </div>
        ))
      )}
    </div>
  );
}
