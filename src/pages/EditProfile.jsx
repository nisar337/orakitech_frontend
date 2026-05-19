import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api.js";
import { useUserAuth } from "../hooks/useUserAuth.js";
import PasswordInput from "../components/ui/PasswordInput.jsx";

const EMPTY_FORM = { label: "Home", fullName: "", phone: "", address: "", city: "", country: "Pakistan", isDefault: false };
const LABELS = ["Home", "Office", "Other"];

function AddressManager({ isLoggedIn }) {
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchAddresses = useCallback(async () => {
    setAddrLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/user/addresses`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setAddresses(data.addresses || []);
    } finally {
      setAddrLoading(false);
    }
  }, []);

  useEffect(() => { if (isLoggedIn) fetchAddresses(); }, [isLoggedIn, fetchAddresses]);

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, isDefault: addresses.length === 0 });
    setError("");
    setShowForm(true);
  }

  function openEdit(addr) {
    setEditingId(addr._id);
    setForm({ label: addr.label || "Home", fullName: addr.fullName || "", phone: addr.phone || "", address: addr.address || "", city: addr.city || "", country: addr.country || "", isDefault: addr.isDefault || false });
    setError("");
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditingId(null); setError(""); }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.address.trim() || !form.city.trim() || !form.country.trim()) {
      setError("Address, city and country are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = editingId
        ? `${API_BASE}/api/auth/user/addresses/${editingId}`
        : `${API_BASE}/api/auth/user/addresses`;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.message || "Could not save address."); return; }
      setAddresses(data.addresses || []);
      closeForm();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/auth/user/addresses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setAddresses(data.addresses || []);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(id) {
    const addr = addresses.find((a) => a._id === id);
    if (!addr) return;
    const res = await fetch(`${API_BASE}/api/auth/user/addresses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...addr, isDefault: true }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) setAddresses(data.addresses || []);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xl font-semibold text-slate-900">My Addresses</p>
        {!showForm && (
          <button
            type="button"
            onClick={openAdd}
            className="rounded-lg bg-[#12366A] px-3 py-1.5 text-xs font-semibold text-white transition-all duration-150 hover:bg-[#0d2550] hover:shadow-md active:scale-95"
          >
            + Add Address
          </button>
        )}
      </div>

      {addrLoading ? (
        <p className="animate-fadeIn text-sm text-slate-500">Loading addresses...</p>
      ) : !showForm && addresses.length === 0 ? (
        <p className="animate-scaleIn text-sm text-slate-500">No addresses saved yet. Add one to speed up checkout!</p>
      ) : null}

      {!showForm && addresses.length > 0 && (
        <div className="space-y-2">
          {addresses.map((addr, idx) => (
            <div key={addr._id} style={{ animationDelay: `${idx * 0.07}s` }} className={`animate-cardIn rounded-xl border p-3 text-sm transition-shadow duration-200 hover:shadow-md ${addr.isDefault ? "border-[#12366A] bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-[#12366A]/10 px-2 py-0.5 text-xs font-semibold text-[#12366A]">{addr.label}</span>
                {addr.isDefault && <span className="rounded-full bg-[#12366A] px-2 py-0.5 text-xs font-semibold text-white">Default</span>}
              </div>
              {addr.fullName && <p className="font-medium text-slate-900">{addr.fullName}</p>}
              <p className="text-slate-700">{addr.address}</p>
              <p className="text-slate-600">{addr.city}, {addr.country}</p>
              {addr.phone && <p className="text-slate-500">{addr.phone}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(addr)}
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 transition-all duration-150 hover:bg-slate-100 hover:shadow-sm active:scale-95"
                >
                  Edit
                </button>
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr._id)}
                    className="rounded border border-[#12366A]/30 bg-white px-2 py-1 text-xs font-medium text-[#12366A] transition-all duration-150 hover:bg-blue-50 hover:shadow-sm active:scale-95"
                  >
                    Set Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(addr._id)}
                  disabled={deletingId === addr._id}
                  className="rounded border border-rose-200 bg-white px-2 py-1 text-xs font-medium text-rose-600 transition-all duration-150 hover:bg-rose-50 hover:shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {deletingId === addr._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSave} className="animate-slideDown space-y-3">
          <p className="text-sm font-semibold text-slate-800">{editingId ? "Edit Address" : "New Address"}</p>

          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-700">Label</label>
              <select
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#12366A]"
              >
                {LABELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Full Name</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="Recipient name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#12366A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+92 300 0000000"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#12366A]"
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-700">Street Address *</label>
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="House / Street / Area"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#12366A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">City *</label>
              <input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="City"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#12366A]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Country *</label>
              <input
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                placeholder="Country"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#12366A]"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                id="isDefault"
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                className="h-4 w-4 rounded accent-[#12366A]"
              />
              <label htmlFor="isDefault" className="text-xs font-medium text-slate-700">Set as default address</label>
            </div>
          </div>

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#12366A] px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#0d2550] hover:shadow-md active:scale-95 disabled:opacity-50"
            >
              {saving ? "Saving…" : editingId ? "Update" : "Save Address"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-50 hover:shadow-sm active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function EditProfile() {
  const { user, isLoggedIn, loading: authLoading, refreshSession } = useUserAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState({ loading: false, message: "", success: false });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setState({ loading: true, message: "", success: false });

    if (newPassword && newPassword !== confirmPassword) {
      setState({
        loading: false,
        message: "New password and confirm password do not match.",
        success: false,
      });
      return;
    }

    try {
      const body = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      };

      if (currentPassword && newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      const res = await fetch(`${API_BASE}/api/auth/user/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState({
          loading: false,
          message: data?.message || "Failed to update profile.",
          success: false,
        });
        return;
      }

      setState({
        loading: false,
        message: "Profile updated successfully!",
        success: true,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      await refreshSession();

      setTimeout(() => {
        navigate("/account");
      }, 1500);
    } catch (err) {
      setState({
        loading: false,
        message: err?.message || "Failed to update profile.",
        success: false,
      });
    }
  }

  if (authLoading) {
    return <main className="mx-auto max-w-7xl px-4 py-8">Loading...</main>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-4">
        <div>
          <AddressManager isLoggedIn={isLoggedIn} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-slideUp">
          <h1 className="mb-2 text-xl font-semibold text-slate-900">Edit Profile</h1>
          <p className="mb-4 text-sm text-slate-600">
            Update your personal information and password
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-900">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
                required
                minLength={2}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-900">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-900">
                Phone Number
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  +92
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
                  placeholder="3001234567"
                  inputMode="numeric"
                  required
                  minLength={10}
                  maxLength={10}
                />
              </div>
            </div>

            <hr className="my-4 border-slate-200" />

            <div>
              <h2 className="mb-2 text-base font-semibold text-slate-900">
                Change Password (Optional)
              </h2>
              <p className="mb-3 text-xs text-slate-600">
                Leave blank if you don't want to change your password
              </p>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-900">
                    Current Password
                  </label>
                  <PasswordInput
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-900">
                    New Password
                  </label>
                  <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-900">
                    Confirm New Password
                  </label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {state.message ? (
              <div
                className={`rounded-lg px-4 py-3 text-sm transition-all duration-300 ${
                  state.success
                    ? "bg-green-50 text-green-800"
                    : "bg-rose-50 text-rose-800"
                }`}
              >
                {state.message}
              </div>
            ) : null}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={state.loading}
                className="rounded-lg bg-[#12366A] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0d1f3d] disabled:opacity-50"
              >
                {state.loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/account")}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
