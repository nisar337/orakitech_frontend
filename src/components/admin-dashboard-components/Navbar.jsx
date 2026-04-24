import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth.js";
import { API_BASE } from "../../config/api.js";

export default function Navbar() {
  const { displayName, logout } = useAdminAuth();
  const [orderCount, setOrderCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

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
        /* ignore badge errors */
      }
    }
    loadCount();
    const t = setInterval(loadCount, 15000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  function updateSearch(value) {
    const next = value || "";
    setSearchValue(next);
    const nextParams = new URLSearchParams(searchParams);
    if (!next.trim()) {
      nextParams.delete("search");
    } else {
      nextParams.set("search", next);
    }
    setSearchParams(nextParams, { replace: true });
  }

  return (
    <div className="bg-white p-4 flex  flex-wrap justify-between items-center gap-3 shadow-sm">
      <input
        type="text"
        placeholder="Search by title, brand, price, customer, or order..."
        value={searchValue}
        onChange={(event) => updateSearch(event.target.value)}
        className="px-4 py-2 border  rounded-lg w-full md:w-1/2"
      />

      <div className="flex items-center gap-4">
        <div className="relative">
          <FaBell />
          <span className="absolute -right-3 -top-3 bg-red-500 text-white px-1.5 rounded-full text-[10px] min-w-5 text-center">
            {orderCount}
          </span>
        </div>
        <span className="text-xs text-gray-600 hidden md:block">
          Orders received: {orderCount}
        </span>
        <div className="flex items-center gap-2">
          <img src="https://i.pravatar.cc/40" alt="" className="rounded-full" />
          <span>{displayName}</span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-sm rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
