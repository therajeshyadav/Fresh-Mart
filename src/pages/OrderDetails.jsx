import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p className="p-6">Loading order details...</p>;

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
              Total: ${order.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Items */}
        <h3 className="font-semibold text-lg mb-3">Items</h3>
        <div className="divide-y divide-gray-200">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="font-medium">{item.name || item.product}</p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × ${item.price}
                </p>
              </div>
              <p className="font-medium">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          ))}
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
