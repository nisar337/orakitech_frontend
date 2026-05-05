import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/admin-dashboard-components/Sidebar";
import Navbar from "./components/admin-dashboard-components/Navbar";
import { HiMenu } from "react-icons/hi";
import Modal from "./components/ui/Modal.jsx";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [flashText, setFlashText] = useState("");
  const [flashModal, setFlashModal] = useState(null);
  const lastFlashKey = useRef("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const raw = location.state?.adminFlash;
    if (raw == null) return;

    const normalized =
      typeof raw === "string"
        ? { type: "success", message: raw.trim(), autoCloseMs: 4500 }
        : typeof raw === "object" && typeof raw.message === "string"
          ? {
              type: raw.type || "default",
              message: raw.message.trim(),
              autoCloseMs: Number.isFinite(raw.autoCloseMs) ? raw.autoCloseMs : 2500,
            }
          : null;

    if (!normalized?.message) return;

    const token = `${location.key}:${normalized.type}:${normalized.message}`;
    if (token === lastFlashKey.current) return;
    lastFlashKey.current = token;

    if (typeof raw === "string") {
      setFlashText(normalized.message);
      setFlashModal(null);
    } else {
      setFlashModal(normalized);
      setFlashText("");
    }

    // Clear navigation state so refresh doesn't re-show the same popup/banner.
    navigate(`${location.pathname}${location.search}`, { replace: true, state: {} });
  }, [location.key, location.state?.adminFlash]);

  useEffect(() => {
    if (!flashText) return;
    const t = setTimeout(() => setFlashText(""), 4500);
    return () => clearTimeout(t);
  }, [flashText]);

  useEffect(() => {
    if (!flashModal?.message) return;
    const t = setTimeout(() => setFlashModal(null), flashModal.autoCloseMs || 2500);
    return () => clearTimeout(t);
  }, [flashModal]);

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
          <Modal
            open={Boolean(flashModal?.message)}
            title={flashModal?.type === "success" ? "Success" : undefined}
            intent={flashModal?.type === "success" ? "success" : "default"}
            placement="top"
            onClose={() => setFlashModal(null)}
            primaryAction={{
              label: "OK",
              onClick: () => setFlashModal(null),
            }}
          >
            <p className="text-sm text-gray-700">{flashModal?.message}</p>
          </Modal>

          {flashText ? (
            <p
              className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-900 shadow-sm"
              role="status"
            >
              {flashText}
            </p>
          ) : null}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
