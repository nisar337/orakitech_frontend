import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../config/api.js";
import { useAdminAuth } from "../hooks/useAdminAuth.js";
import { formatPkrFromUsd } from "../utils/currency.js";

function fmtDate(value) {
  if (!value) return "—";
  const dt = new Date(value);
  return dt.toLocaleString();
}

export default function AdminCustomers() {
  const { adminFetch } = useAdminAuth();
  const [customers, setCustomers] = useState([]);
  const [state, setState] = useState({ loading: true, message: "" });

  const loadCustomers = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setState({ loading: true, message: "" });
    }
    try {
      const res = await adminFetch(`${API_BASE}/api/auth/admin/customers`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (isInitialLoad) {
          setState({
            loading: false,
            message: data?.message || "Could not load customer accounts.",
          });
        }
        return;
      }
      setCustomers(Array.isArray(data.customers) ? data.customers : []);
      if (isInitialLoad) {
        setState({ loading: false, message: "" });
      }
    } catch (err) {
      if (isInitialLoad) {
        setState({
          loading: false,
          message: err?.message || "Could not load customer accounts.",
        });
      }
    }
  }, [adminFetch]);

  useEffect(() => {
    loadCustomers(true);
    const t = setInterval(loadCustomers, 10000);
    return () => clearInterval(t);
  }, [loadCustomers]);

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-[#112B54]">Customer Accounts</h1>
        <p className="mt-1 text-sm text-gray-600">
          All registered users, their profile data, and order activity from database.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {state.loading ? <p className="text-sm text-slate-600">Loading users...</p> : null}
        {!state.loading && state.message ? (
          <p className="text-sm text-rose-600">{state.message}</p>
        ) : null}
        {!state.loading && !state.message && customers.length === 0 ? (
          <p className="text-sm text-slate-600">No customer accounts found.</p>
        ) : null}

        {!state.loading && !state.message && customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Joined</th>
                  <th className="px-3 py-2">Last Active</th>
                  <th className="px-3 py-2">Online</th>
                  <th className="px-3 py-2">Orders</th>
                  <th className="px-3 py-2">Spent</th>
                  <th className="px-3 py-2">Latest Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-2 font-medium text-slate-900">{c.name || "—"}</td>
                    <td className="px-3 py-2">{c.email || "—"}</td>
                    <td className="px-3 py-2">{c.phone || "—"}</td>
                    <td className="px-3 py-2">{fmtDate(c.createdAt)}</td>
                    <td className="px-3 py-2">{fmtDate(c.lastActiveAt || c.lastLoginAt)}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          c.isActiveNow
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            c.isActiveNow ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {c.isActiveNow ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="px-3 py-2">{c.totalOrders || 0}</td>
                    <td className="px-3 py-2 font-medium text-[#112B54]">
                      {formatPkrFromUsd(c.totalSpentUsd || 0)}
                    </td>
                    <td className="px-3 py-2 capitalize">{c.latestOrderStatus || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
