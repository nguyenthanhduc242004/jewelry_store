type Customer = {
  customerName: string;
  totalSpent: number;
};

type CustomersListProps = {
  customers: Customer[];
};

export default function SellersList({ customers }: CustomersListProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold text-lg">Top 5 Customers</h3>
      <p className="text-xs text-gray-400 mb-4">Most spending customers</p>

      {customers.length === 0 ? (
        <p className="text-sm text-gray-500">No data available</p>
      ) : (
        customers.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-3">
            <span className="font-medium">{item.customerName}</span>
            <span className="text-gray-600 text-sm">
              {item.totalSpent.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
            </span>
          </div>
        ))
      )}
    </div>
  );
}
