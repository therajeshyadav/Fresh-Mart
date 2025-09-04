import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { OrdersApi } from "../api/auth"; // ✅ wrapper

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await OrdersApi.get(id); // ✅ wrapper call
        setOrder(data); // wrapper should return order object
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-6">Loading order details...</p>;
  if (!order) return <p className="p-6 text-red-600">Order not found.</p>;

  const items = order.items || order.orderItems || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Order #{order._id}</h2>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Processing"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Order summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Shipping</h3>
            <p className="text-gray-700">{order.shippingAddress?.address}</p>
            <p className="text-gray-700">
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
            </p>
            <p className="text-gray-700">{order.shippingAddress?.country}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Payment</h3>
            <p className="text-gray-700">{order.paymentMethod}</p>
            <p className="text-gray-700 font-medium">
              Total: ${order.totalPrice?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        {/* Items */}
        <h3 className="font-semibold text-lg mb-3">Items</h3>
        <div className="divide-y divide-gray-200">
          {items.length > 0 ? (
            items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{item.name || item.product}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} × ${item.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <p className="font-medium">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items found in this order.</p>
          )}
        </div>

        {/* Back button */}
        <div className="mt-6">
          <Link
            to="/orders"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
