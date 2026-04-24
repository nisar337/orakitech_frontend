import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../config/api.js";
import { useAdminAuth } from "../hooks/useAdminAuth.js";

export default function AdminUsers() {
  const { username, fullName, displayName, adminFetch } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
  });
  const [formStatus, setFormStatus] = useState({ kind: "", message: "" });
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const loadAdmins = useCallback(async () => {
    setLoadError("");
    try {
      const res = await adminFetch(`${API_BASE}/api/auth/admin/users`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadError(data.message || "Could not load admins.");
        return;
      }
      setAdmins(Array.isArray(data.admins) ? data.admins : []);
    } catch (e) {
      setLoadError(e?.message || "Network error.");
    }
  }, [adminFetch]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  function onFormChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onCreateAdmin(e) {
    e.preventDefault();
    setFormStatus({ kind: "", message: "" });
    setBusy(true);
    try {
      const res = await adminFetch(`${API_BASE}/api/auth/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormStatus({
          kind: "error",
          message: data.message || "Could not create admin.",
        });
        return;
      }
      setFormStatus({
        kind: "success",
        message: `Admin “${data.admin?.username || form.username}” saved to the database.`,
      });
      setForm({ username: "", password: "", fullName: "", email: "" });
      await loadAdmins();
    } catch (err) {
      setFormStatus({
        kind: "error",
        message: err?.message || "Network error.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function onDeleteAdmin(id, username, isPrimary) {
    if (!id || isPrimary) return;
    if (
      !window.confirm(
        `Remove admin “${username}” from the database? They will no longer be able to sign in.`
      )
    ) {
      return;
    }
    setDeleteError("");
    setDeletingId(id);
    try {
      const res = await adminFetch(`${API_BASE}/api/auth/admin/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data.message || "Could not delete admin.");
        return;
      }
      await loadAdmins();
    } catch (e) {
      setDeleteError(e?.message || "Network error.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#112B54]">Admin users</h1>
            <p className="text-sm text-gray-600 max-w-2xl">
              Manage admin access with a clean, modern admin panel experience.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            Secure access
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold mb-3">Owner</h2>
            <dl className="grid gap-3 text-sm text-gray-700">
              <div className="grid grid-cols-[110px_1fr] items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <dt className="text-gray-500">Display</dt>
                <dd className="font-medium text-[#112B54]">{displayName}</dd>
              </div>
              <div className="grid grid-cols-[110px_1fr] items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <dt className="text-gray-500">Username</dt>
                <dd>{username || "—"}</dd>
              </div>
              {fullName ? (
                <div className="grid grid-cols-[110px_1fr] items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <dt className="text-gray-500">Full name</dt>
                  <dd>{fullName}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-semibold">All admins</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {admins.length} admin{admins.length === 1 ? "" : "s"}
              </span>
            </div>
            {deleteError ? (
              <p className="mb-3 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {deleteError}
              </p>
            ) : null}
            {loadError ? (
              <p className="text-sm text-red-700">{loadError}</p>
            ) : admins.length === 0 ? (
              <p className="text-sm text-gray-500">No rows loaded.</p>
            ) : (
              <ul className="space-y-3">
                {admins.map((a) => (
                  <li
                    key={a._id || a.username}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-[#112B54]">{a.username}</span>
                          {a.isPrimary ? (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                              Primary
                            </span>
                          ) : null}
                        </div>
                        <p className="text-gray-600">{a.fullName || "—"}</p>
                        <p className="text-gray-500">{a.email || "—"}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={
                          a.active === false
                            ? "rounded-full bg-amber-100 px-2 py-1 text-amber-900"
                            : "rounded-full bg-emerald-100 px-2 py-1 text-emerald-900"
                        }>
                          {a.active === false ? "Inactive" : "Active"}
                        </span>
                        {a.isPrimary ? (
                          <span className="text-xs text-slate-400">Owner</span>
                        ) : (
                          <button
                            type="button"
                            disabled={deletingId === a._id}
                            onClick={() => onDeleteAdmin(a._id, a.username, a.isPrimary)}
                            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === a._id ? "Removing…" : "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <form
          onSubmit={onCreateAdmin}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4"
        >
          <h2 className="font-semibold text-[#112B54]">Add new admin</h2>
          {formStatus.message ? (
            <p
              className={`rounded-lg border px-3 py-2 text-sm ${
                formStatus.kind === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
              role="status"
            >
              {formStatus.message}
            </p>
          ) : null}
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Create a new admin account safely without changing routes or API behavior.
          </div>
          <div>
            <label className="text-xs text-gray-600">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={onFormChange}
              required
              autoComplete="off"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
              placeholder="newadmin"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Password (min 8)</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onFormChange}
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Full name (optional)</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={onFormChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Email (optional)</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onFormChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-[#112B54] px-6 py-3 font-semibold text-white hover:opacity-95 disabled:opacity-60"
            >
              {busy ? "Saving…" : "Create admin in database"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
