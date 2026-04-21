import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/admin-dashboard-components/Sidebar";
import Navbar from "./components/admin-dashboard-components/Navbar";
import { HiMenu } from "react-icons/hi";

export default function AdminLayout() {
  const location = useLocation();
  const [flash, setFlash] = useState("");
  const lastFlashKey = useRef("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const raw = location.state?.adminFlash;
    if (typeof raw !== "string" || !raw.trim()) return;
    const token = `${location.key}:${raw.trim()}`;
    if (token === lastFlashKey.current) return;
    lastFlashKey.current = token;
    setFlash(raw.trim());
  }, [location.key, location.state?.adminFlash]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(""), 4500);
    return () => clearTimeout(t);
  }, [flash]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 md:ml-0">
        <div className="md:hidden p-4 bg-white shadow-sm flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <HiMenu className="text-xl" />
          </button>
          <h1 className="text-lg font-semibold text-[#112B54]">Admin Panel</h1>
          <div></div>
        </div>
        <Navbar />

        <div className="p-4 md:p-6">
          {flash ? (
            <p
              className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-900 shadow-sm"
              role="status"
            >
              {flash}
            </p>
          ) : null}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
