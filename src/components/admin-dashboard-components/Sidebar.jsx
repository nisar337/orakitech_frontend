import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiHome, HiShoppingBag, HiPlusCircle, HiChartPie, HiUsers, HiCube, HiClipboardList, HiChatAlt2, HiShieldCheck } from "react-icons/hi";
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

const iconMap = {
  "/admin": HiHome,
  "/admin/products": HiShoppingBag,
  "/admin/add": HiPlusCircle,
  "/admin/orders": HiChartPie,
  "/admin/users": HiUsers,
  "/admin/categories": HiCube,
  "/admin/analytics": HiClipboardList,
  "/admin/reviews": HiChatAlt2,
  "/admin/messages": HiShieldCheck,
};

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
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

  const sidebarContent = (
    <div className="h-full min-h-screen w-64 bg-[#0d2a5d] text-white p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] border-r border-white/10">
      <Link
        to="/admin"
        className="mb-2 block rounded-[28px]  px-4 py-3 text-lg font-semibold uppercase tracking-[0.18em] text-white  "
      >
        ORAKITECH
      </Link>


      <ul className="space-y-3">
        {menu.map(([label, to]) => {
          const isActive = location.pathname === to;
          const Icon = iconMap[to];
          return (
            <li key={to}>
              <Link
                to={to}
                onClick={onClose}
                className={`group flex items-center justify-between rounded-[22px]  text-sm transition duration-300 ease-out ${
                  isActive
                    ? "bg-white/15 text-white shadow-[0_18px_30px_-18px_rgba(255,255,255,0.9)]"
                    : "bg-white/5 text-slate-100 hover:bg-white/15 hover:text-white hover:-translate-x-0.5"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-slate-200 transition duration-300 ${
                      isActive ? "bg-white/20 text-white" : "group-hover:bg-white/20 group-hover:text-white"
                    }`}>
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                  </span>
                  {label}
                </span>
                {to === "/admin/orders" ? (
                  <span className="ml-2 mr-3  rounded-full bg-sky-500 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white shadow-sm shadow-sky-500/30">
                    {orderCount}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 overflow-y-auto">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="relative">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
