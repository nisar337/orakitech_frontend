import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../config/api.js";
import { useAdminAuth } from "../hooks/useAdminAuth.js";
import { formatPkrFromUsd } from "../utils/currency.js";
import Modal from "../components/ui/Modal.jsx";
import OrderSuccessToast from "../components/OrderSuccessToast.jsx";

function fmtDate(value) {
  if (!value) return "—";
  const dt = new Date(value);
  return dt.toLocaleString();
}

export default function AdminCustomers() {
  const { adminFetch } = useAdminAuth();
  const [customers, setCustomers] = useState([]);
  const [state, setState] = useState({ loading: true, message: "" });
  const [deletingId, setDeletingId] = useState("");
  const [confirmCustomer, setConfirmCustomer] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const deleteCustomer = useCallback(
    async (customer) => {
      if (!customer?.id) return;
      setDeletingId(customer.id);
      setState((prev) => ({ ...prev, message: "" }));
      try {
        const res = await adminFetch(
          `${API_BASE}/api/auth/admin/customers/${customer.id}`,
          { method: "DELETE" }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState({ loading: false, message: data?.message || "Delete failed." });
          return;
        }
        setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
        setShowDeleteToast(true);
      } catch (err) {
        setState({ loading: false, message: err?.message || "Delete failed." });
      } finally {
        setDeletingId("");
      }
    },
    [adminFetch]
  );

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
    <section className="space-y-5 w-full">
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
                  <th className="px-3 py-2 text-right">Actions</th>
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
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmCustomer(c);
                          setConfirmOpen(true);
                        }}
                        disabled={deletingId === c.id}
                        className="inline-flex cursor-pointer items-center justify-center rounded-md border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === c.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
      <Modal
        open={confirmOpen}
        title="Delete customer"
        maxWidthClassName="max-w-md"
        onClose={() => {
          if (!deletingId) {
            setConfirmOpen(false);
            setConfirmCustomer(null);
          }
        }}
      >
        <div className="space-y-4 text-sm text-slate-700">
          <p>
            Delete <strong>{confirmCustomer?.name || "this customer"}</strong>? This
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmOpen(false);
                setConfirmCustomer(null);
              }}
              disabled={Boolean(deletingId)}
              className="rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                await deleteCustomer(confirmCustomer);
                setConfirmOpen(false);
                setConfirmCustomer(null);
              }}
              disabled={!confirmCustomer || Boolean(deletingId)}
              className="rounded-md bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {deletingId ? "Deleting..." : "Yes, delete"}
            </button>
          </div>
        </div>
      </Modal>
      <OrderSuccessToast
        show={showDeleteToast}
        message="Customer deleted successfully."
        onDismiss={() => setShowDeleteToast(false)}
      />
    </section>
  );
}
