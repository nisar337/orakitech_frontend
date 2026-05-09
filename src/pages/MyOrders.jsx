import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { API_BASE } from "../config/api.js";
import { useUserAuth } from "../hooks/useUserAuth.js";
import { formatPkrFromUsd } from "../utils/currency.js";

function fmtDate(value) {
  if (!value) return "";
  const dt = new Date(value);
  return dt.toLocaleDateString();
}

const FILTERS = ["all", "new", "shipped", "delivered"];

export default function MyOrders() {
  const { isLoggedIn, loading: authLoading } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [state, setState] = useState({ loading: true, message: "" });

  const fetchOrders = useCallback(async () => {
    if (!isLoggedIn) {
      setOrders([]);
      setState({ loading: false, message: "Please sign in to view your orders." });
      return;
    }
    setState({ loading: true, message: "" });
    try {
      const res = await fetch(`${API_BASE}/api/orders/my`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ loading: false, message: data?.message || "Could not load your orders." });
        return;
      }
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setState({ loading: false, message: "" });
    } catch (err) {
      setState({ loading: false, message: err?.message || "Could not load your orders." });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const visibleOrders = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) =>
      String(o.status || "")
        .toLowerCase()
        .includes(filter)
    );
  }, [orders, filter]);

  if (authLoading) {
    return <main className="mx-auto max-w-6xl px-4 py-8">Loading orders...</main>;
  }
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 animate-fadeIn">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 animate-slideUp">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOrders}
            disabled={state.loading}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {state.loading ? "Refreshing…" : "Refresh"}
          </button>
          <Link to="/account" className="text-sm font-medium text-[#12366A] underline">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              filter === f
                ? "bg-[#12366A] text-white"
                : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {state.loading ? <p className="text-sm text-slate-600">Loading orders...</p> : null}
      {!state.loading && state.message ? <p className="text-sm text-rose-600">{state.message}</p> : null}
      {!state.loading && !state.message && visibleOrders.length === 0 ? (
        <p className="text-sm text-slate-600">No orders found for this filter.</p>
      ) : null}

      <div className="space-y-3">
        {visibleOrders.map((order) => (
          <article key={order._id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-900">
                  Order #{String(order._id).slice(-6)}
                </p>
                <p className="text-sm text-slate-500">Placed: {fmtDate(order.createdAt)}</p>
                <p className="text-sm text-slate-700">
                  Status: <span className="font-semibold capitalize">{order.status || "new"}</span>
                </p>
              </div>
              <p className="text-lg font-semibold text-[#12366A]">
                {formatPkrFromUsd(order.totalUSD || 0)}
              </p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(order.items || []).map((item, idx) => (
                <div key={`${order._id}-${idx}`} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-slate-600">
                    Qty: {item.quantity} · {formatPkrFromUsd(item.unitPrice || 0)} each
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
