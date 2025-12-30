import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserService, type UserSummary } from "../../../../services/user.service";
import { ProductService, type ProductPreview } from "../../../../services/product.service";
import { OrderService } from "../../../../services/order.service";
import { AuthService } from "../../../../services/auth.service";
import { extractUserId } from "../../../../utils/user.utils";

type OrderDetailRow = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
};

const formatDate = () => {
  const d = new Date();
  return d.toLocaleDateString("vi-VN");
};

export default function AddOrder() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<UserSummary[]>([]);
  const [products, setProducts] = useState<ProductPreview[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailRow[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [creatorName, setCreatorName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const [customersData, productsData, me] = await Promise.all([
          UserService.fetchUserSummary(0, 100, { signal: controller.signal }),
          ProductService.fetchProductPreview(0, 100, { signal: controller.signal }),
          AuthService.me({ signal: controller.signal })
        ]);
        // Filter customers to only include users with 'Customer' role
        const customerUsers = customersData.filter(
          (user) => user.role?.toLowerCase() === "customer"
        );
        setCustomers(customerUsers);
        setProducts(productsData);
        setCreatorName(me.fullName || "Current User");
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load data");
      }
    })();

    return () => controller.abort();
  }, []);

  // Load customer info when selected
  useEffect(() => {
    if (selectedCustomerId) {
      const customer = customers.find((c) => c.id === selectedCustomerId);
      if (customer) {
        setShippingAddress(customer.address || "");
        setPhoneNumber(customer.phone || "");
      }
    }
  }, [selectedCustomerId, customers]);

  const handleAddProduct = () => {
    if (!selectedProductId || quantity <= 0) {
      alert("Please select a product and enter a valid quantity");
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    // Check if quantity exceeds stock
    if (quantity > product.quantity) {
      alert(`Insufficient stock. Available: ${product.quantity}, Requested: ${quantity}`);
      return;
    }

    // Check if product already added
    if (orderDetails.some((d) => d.productId === selectedProductId)) {
      alert("Product already added to this order");
      return;
    }

    const newDetail: OrderDetailRow = {
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      totalPrice: product.price * quantity
    };

    setOrderDetails([...orderDetails, newDetail]);
    setSelectedProductId(null);
    setQuantity(1);
  };

  const handleRemoveProduct = (productId: number) => {
    setOrderDetails(orderDetails.filter((d) => d.productId !== productId));
  };

  const totalPrice = orderDetails.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = async () => {
    if (!selectedCustomerId) {
      alert("Please select a customer");
      return;
    }

    if (orderDetails.length === 0) {
      alert("Please add at least one product");
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address");
      return;
    }

    if (!phoneNumber.trim()) {
      alert("Please enter a phone number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const me = await AuthService.me();
      const staffId = extractUserId(me);

      // Create order form
      const createdOrder = await OrderService.createOrder({
        userId: selectedCustomerId,
        staffId: staffId || 0,
        dateCreated: new Date().toISOString(),
        shippingAddress: shippingAddress,
        phoneNumber: phoneNumber,
        totalPrice: totalPrice,
        status: "0" // Pending status
      });

      // Add all order details
      for (const detail of orderDetails) {
        await OrderService.addOrderDetail(createdOrder.id, {
          productId: detail.productId,
          quantity: detail.quantity
        });
      }

      alert("Order created successfully!");
      navigate(`/manager/order/${createdOrder.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phone.toLowerCase().includes(customerSearch.toLowerCase())
  );

  return (
    <div className="space-y-5 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Add New Order</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/manager/order")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-blue-500 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Order"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Order Information */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Order Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-2">Customer *</label>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <select
              value={selectedCustomerId || ""}
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a customer</option>
              {filteredCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.fullName} - {customer.email} - {customer.phone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm text-slate-500">Created by</p>
            <p className="text-sm font-medium text-slate-700">{creatorName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Date Created</p>
            <p className="text-sm font-medium text-slate-700">{formatDate()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Price</p>
            <p className="text-sm font-medium text-slate-700">
              {totalPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Information */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Shipping Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-500 block mb-2">Shipping Address *</label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter shipping address"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500 block mb-2">Phone Number *</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </section>

      {/* Add Product Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Add Products</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-slate-500 block mb-2">Product</label>
            <select
              value={selectedProductId || ""}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.price.toLocaleString("vi-VN")} VND (Stock:{" "}
                  {product.quantity})
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="text-sm text-slate-500 block mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddProduct}
            disabled={
              !selectedProductId ||
              quantity <= 0 ||
              (selectedProductId
                ? (products.find((p) => p.id === selectedProductId)?.quantity || 0) < quantity
                : false)
            }
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Add Product
          </button>
        </div>
      </section>

      {/* Products Table */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center">
            <thead>
              <tr className="bg-[#1279C3] text-white">
                <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">
                  Product Name
                </th>
                <th className="px-4 py-3 font-medium text-center align-middle">Quantity</th>
                <th className="px-4 py-3 font-medium text-center align-middle">Price</th>
                <th className="px-4 py-3 font-medium text-center align-middle">Subtotal</th>
                <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No products added yet
                  </td>
                </tr>
              ) : (
                orderDetails.map((item, index) => {
                  const bg =
                    index % 2 === 0
                      ? "bg-slate-50/60 border-b border-slate-100"
                      : "border-b border-slate-100";
                  return (
                    <tr key={item.productId} className={`${bg} text-center`}>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                        {item.productName}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-xs text-slate-700">
                        {item.price.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">
                        {item.totalPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <button
                          onClick={() => handleRemoveProduct(item.productId)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300">
                <td
                  colSpan={3}
                  className="px-4 py-3 text-sm font-semibold text-right text-slate-700"
                >
                  Total:
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-center text-slate-700">
                  {totalPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
