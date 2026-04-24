import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config/api.js";
import { formatPkrFromUsd } from "../utils/currency.js";

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

export default function AdminAnalytics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/orders`);
        const data = await res.json().catch(() => null);
        if (!active) return;
        if (!res.ok) {
          setError(data?.message || "Could not load analytics data.");
          setOrders([]);
          return;
        }
        setOrders(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Network error.");
        setOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalUSD || 0), 0);
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const sources = orders.reduce((map, order) => {
      const key = String(order.source || "unknown").replace("_", " ");
      map[key] = (map[key] || 0) + 1;
      return map;
    }, {});

    const productMap = new Map();
    for (const order of orders) {
      for (const item of order.items || []) {
        const key = item.title || item.slug || "Unknown product";
        const count = productMap.get(key) || 0;
        productMap.set(key, count + Number(item.quantity || 0));
      }
    }

    const topProducts = [...productMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const recent = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      sources,
      topProducts,
      recent,
    };
  }, [orders]);

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#112B54]">Analytics</h1>
            
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            View full orders
          </Link>
        </div>
      </section>

      {error ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </section>
      ) : loading ? (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <div className="h-6 w-48 rounded-full bg-slate-100 animate-pulse" />
            <div className="h-4 w-64 rounded-full bg-slate-100 animate-pulse" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-28 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : stats.totalOrders === 0 ? (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm text-gray-500">
          No orders yet. When customers place orders, analytics metrics will appear here.
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Total revenue</p>
                <p className="mt-3 text-2xl font-bold text-[#112B54]">
                  {formatPkrFromUsd(stats.totalRevenue)}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Total orders</p>
                <p className="mt-3 text-2xl font-bold text-[#112B54]">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Avg. order value</p>
                <p className="mt-3 text-2xl font-bold text-[#112B54]">
                  {formatPkrFromUsd(stats.averageOrderValue)}
                </p>
              </div>
            </div>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#112B54]">Top products by quantity</h2>
                <span className="text-sm text-gray-500">Last {orders.length} orders</span>
              </div>
              <div className="space-y-3">
                {stats.topProducts.map(([title, quantity]) => (
                  <div key={title} className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-gray-800">{title}</p>
                      <p className="text-sm text-gray-500">{quantity} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#112B54] mb-4">Order sources</h2>
              <div className="space-y-3">
                {Object.entries(stats.sources).map(([source, count]) => (
                  <div key={source} className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm text-gray-700">
                      <span>{source}</span>
                      <span>{count} order{count === 1 ? "" : "s"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#112B54] mb-4">Recent orders</h2>
              <div className="space-y-3">
                {stats.recent.map((order) => (
                  <div key={order._id} className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm text-gray-700">
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>{formatPkrFromUsd(order.totalUSD)}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {order.customer?.fullName || "Unknown customer"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      )}
    </main>
  );
}
