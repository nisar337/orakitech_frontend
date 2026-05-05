import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth.js";
import { API_BASE } from "../../config/api.js";
import Modal from "../ui/Modal.jsx";

export default function Navbar() {
  const { displayName, logout, username, fullName, email, role, avatarUrl, adminFetch, updateUser } =
    useAdminAuth();
  const [orderCount, setOrderCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState("");

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

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview("");
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  async function uploadAvatar() {
    if (!avatarFile || avatarBusy) return;
    setAvatarError("");
    setAvatarBusy(true);
    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      const res = await adminFetch(`${API_BASE}/api/auth/admin/me/avatar`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAvatarError(data.message || "Could not upload avatar.");
        return;
      }
      if (data?.user?.avatarUrl) {
        updateUser({ avatarUrl: data.user.avatarUrl });
      }
      setAvatarFile(null);
      setProfileOpen(false);
    } catch (e) {
      setAvatarError(e?.message || "Could not upload avatar.");
    } finally {
      setAvatarBusy(false);
    }
  }

  const shownAvatar =
    avatarPreview ||
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "Admin")}&background=112B54&color=fff`;

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
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50"
          title="View profile"
        >
          <img
            src={shownAvatar}
            alt=""
            className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-200"
          />
          <span className="text-sm font-medium text-gray-800">{displayName}</span>
        </button>
        <button
          type="button"
          onClick={() => setConfirmLogoutOpen(true)}
          className="text-sm rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      <Modal
        open={confirmLogoutOpen}
        title="Confirm logout"
        intent="danger"
        onClose={() => setConfirmLogoutOpen(false)}
        secondaryAction={{ label: "No", onClick: () => setConfirmLogoutOpen(false) }}
        primaryAction={{
          label: "Yes",
          onClick: () => {
            setConfirmLogoutOpen(false);
            logout();
          },
        }}
      >
        <p className="text-sm text-gray-700">Are you sure you want to logout?</p>
      </Modal>

      <Modal
        open={profileOpen}
        title="Admin profile"
        intent="default"
        onClose={() => {
          setProfileOpen(false);
          setAvatarError("");
          setAvatarFile(null);
        }}
        secondaryAction={{ label: "Close", onClick: () => setProfileOpen(false) }}
        primaryAction={
          avatarFile
            ? {
                label: avatarBusy ? "Uploading…" : "Upload picture",
                onClick: uploadAvatar,
              }
            : null
        }
      >
        <div className="flex items-start gap-4">
          <img
            src={shownAvatar}
            alt=""
            className="h-16 w-16 rounded-2xl object-cover ring-1 ring-gray-200"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#112B54]">
              {fullName || username || "Admin"}
            </p>
            <p className="mt-0.5 text-sm text-gray-600 break-all">
              {email || "—"}
            </p>
            <p className="mt-1 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
              {role || "Admin"}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700">
            Profile picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setAvatarError("");
              setAvatarFile(file);
            }}
            className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
          />
          <p className="mt-2 text-xs text-gray-500">
            JPG/PNG/WEBP up to 4MB.
          </p>
          {avatarError ? (
            <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {avatarError}
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
