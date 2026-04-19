import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config/api.js";
import { formatPkrFromUsd } from "../../utils/currency.js";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders`);
        const data = await res.json().catch(() => []);
        if (cancelled) return;
        if (res.ok && Array.isArray(data)) setOrders(data.slice(0, 5));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Recent orders</h2>
        <Link
          to="/admin/orders"
          className="text-sm text-blue-600 hover:underline"
        >
          View all
        </Link>
      </div>
      {!orders.length ? (
        <p className="text-gray-500 text-sm">
          No orders yet. Customers can buy from the product page or cart.
        </p>
      ) : (
        <ul className="space-y-2">
          {orders.map((o) => (
            <li
              key={o._id}
              className="flex justify-between gap-2 border-t border-gray-100 pt-2 text-sm"
            >
              <span className="text-gray-600 truncate">
                {o.createdAt
                  ? new Date(o.createdAt).toLocaleString()
                  : "Order"}{" "}
                · {(o.items || []).length} line(s)
              </span>
              <span className="font-medium whitespace-nowrap">
                {formatPkrFromUsd(o.totalUSD)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
