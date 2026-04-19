import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../../config/api.js";

const menu = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Add product", "/admin/add"],
  ["Orders", "/admin/orders"],
  ["Admin Access", "/admin/users"],
  ["Categories", "/admin/categories"],
  ["Analytics", "/admin/analytics"],
  ["Reviews", "/admin/reviews"],
  ["Messages", "/admin/messages"],
];

export default function Sidebar() {
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadCount() {
      try {
        const res = await fetch(`${API_BASE}/api/orders`);
        const data = await res.json().catch(() => []);
        if (!cancelled && res.ok && Array.isArray(data)) {
          setOrderCount(data.length);
        }
      } catch {
        /* ignore */
      }
    }
    loadCount();
    const t = setInterval(loadCount, 15000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="w-64 bg-[#112B54] text-white p-5 hidden md:block">
      <Link to="/admin" className="block text-xl font-bold mb-8 hover:opacity-90">
        ORAKITECH
      </Link>

      <ul className="space-y-3">
        {menu.map(([label, to]) => (
          <li key={to}>
            <Link
              to={to}
              className="flex items-center justify-between p-2 text-left rounded-lg hover:bg-white/10"
            >
              <span>{label}</span>
              {to === "/admin/orders" ? (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs">
                  {orderCount}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
