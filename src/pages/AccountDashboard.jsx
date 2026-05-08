import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { API_BASE } from "../config/api.js";
import { useUserAuth } from "../hooks/useUserAuth.js";

function fmtDate(value) {
  if (!value) return "";
  const dt = new Date(value);
  return dt.toLocaleDateString();
}

function statusBarClass(status = "") {
  const s = String(status).toLowerCase();
  if (s.includes("deliver")) return "w-full bg-green-500";
  if (s.includes("ship")) return "w-2/3 bg-green-500";
  if (s.includes("process")) return "w-1/2 bg-amber-500";
  return "w-1/3 bg-blue-500";
}


export default function AccountDashboard() {
  const { user, isLoggedIn, loading: authLoading } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState({ loading: true, message: "", lastSyncAt: "" });

  useEffect(() => {
    if (!isLoggedIn) {
      setOrders([]);
      setState({ loading: false, message: "Please sign in to view your account." });
      return;
    }
    let active = true;
    async function run(silent = false) {
      if (!silent) {
        setState((prev) => ({ ...prev, loading: true, message: "" }));
      }
      try {
        const res = await fetch(`${API_BASE}/api/orders/my`, {
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!active) return;
        if (!res.ok) {
          setState({
            loading: false,
            message: data?.message || "Could not load your orders.",
            lastSyncAt: "",
          });
          return;
        }
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setState({
          loading: false,
          message: "",
          lastSyncAt: new Date().toLocaleTimeString(),
        });
      } catch (err) {
        if (!active) return;
        setState({
          loading: false,
          message: err?.message || "Could not load your orders.",
          lastSyncAt: "",
        });
      }
    }
    run();
    const t = setInterval(() => run(true), 10000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [isLoggedIn]);

  const latestOrders = useMemo(() => orders.slice(0, 2), [orders]);

  if (authLoading) {
    return <main className="mx-auto max-w-7xl px-4 py-8">Loading account...</main>;
  }
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 animate-fadeIn">
      <section className="mb-4 rounded-2xl bg-[#12366A] px-4 py-4 text-white animate-slideUp">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            
            <div>
              <p className="text-3xl font-semibold">
                Welcome , {user?.name || "User"}!
              </p>
              
            </div>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-2">
            
            <p className="text-sm text-white/80">
              Email: {user?.email || "N/A"} | Phone: {user?.phone || "N/A"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold text-slate-900">My Orders</h2>
            <span className="text-xs text-slate-500">
              {state.lastSyncAt ? `Live: ${state.lastSyncAt}` : "Live"}
            </span>
          </div>
          {state.loading ? <p className="text-sm text-slate-500">Loading orders...</p> : null}
          {!state.loading && state.message ? (
            <p className="text-sm text-rose-600">{state.message}</p>
          ) : null}
          {!state.loading && !state.message && latestOrders.length === 0 ? (
            <p className="text-sm text-slate-500">No orders yet.</p>
          ) : null}
          <div className="space-y-3">
            {latestOrders.map((order) => (
              <article
                key={order._id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  Order #{String(order._id).slice(-6)} - {order.status || "new"}
                </p>
                <p className="mb-2 text-xs text-slate-500">Placed on: {fmtDate(order.createdAt)}</p>
                <div className="mb-2 h-2 rounded bg-slate-200">
                  <div className={`h-2 rounded ${statusBarClass(order.status)}`} />
                </div>
                <button className="rounded-md bg-[#12366A] px-3 py-1.5 text-xs font-semibold text-white">
                  Track Package
                </button>
              </article>
            ))}
          </div>
          <Link
            to="/account/orders"
            className="mt-3 inline-block text-sm font-medium text-[#12366A] underline"
          >
            View all orders
          </Link>
        </div>

        <div className="grid gap-3 lg:col-span-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xl font-semibold text-slate-900">Order Support</p>
            <p className="text-sm text-slate-600">+92 333 3777337</p>
          </div>
          
          <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2">
            <p className="text-xl font-semibold text-slate-900">Profile Details</p>
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              <p>Name: {user?.name || "N/A"}</p>
              <p>Email: {user?.email || "N/A"}</p>
              <p>Phone: {user?.phone || "N/A"}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
