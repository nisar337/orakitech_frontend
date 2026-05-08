import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE } from "../../config/api.js";
import { formatPkrFromUsd } from "../../utils/currency.js";
import { matchesOrderSearch } from "../../utils/adminSearch.js";
import Modal from "../ui/Modal.jsx";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [searchParams] = useSearchParams();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  const searchQuery = String(searchParams.get("search") || "").trim();

  const filteredOrders = useMemo(
    () => orders.filter((order) => matchesOrderSearch(order, searchQuery)),
    [orders, searchQuery]
  );

  async function loadOrders() {
    try {
      const res = await fetch(`${API_BASE}/api/orders`);
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || "Could not load orders.");
        setOrders([]);
        return;
      }
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e?.message || "Network error.");
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadOrders();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function beginEdit(order) {
    setEditingId(order._id);
    setDraft({
      fullName: order.customer?.fullName || "",
      email: order.customer?.email || "",
      phone: order.customer?.phone || "",
      address: order.customer?.address || "",
      city: order.customer?.city || "",
      country: order.customer?.country || "",
      notes: order.customer?.notes || "",
      status: order.status || "new",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function openSaveConfirm() {
    setSaveConfirmOpen(true);
  }

  async function confirmSave() {
    if (!draft || !editingId) return;
    setSavingId(editingId);
    try {
      const res = await fetch(`${API_BASE}/api/orders/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: "cod",
          status: draft.status,
          customer: {
            fullName: draft.fullName,
            email: draft.email,
            phone: draft.phone,
            address: draft.address,
            city: draft.city,
            country: draft.country,
            notes: draft.notes,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Could not update order.");
        setSaveConfirmOpen(false);
        return;
      }
      setOrders((prev) => prev.map((o) => (o._id === editingId ? data : o)));
      cancelEdit();
      setError(null);
      setSaveConfirmOpen(false);
    } catch (e) {
      setError(e?.message || "Network error.");
      setSaveConfirmOpen(false);
    } finally {
      setSavingId(null);
    }
  }

  function openDeleteConfirm(orderId) {
    setOrderToDelete(orderId);
    setDeleteConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!orderToDelete) return;
    setSavingId(orderToDelete);
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Could not delete order.");
        setDeleteConfirmOpen(false);
        return;
      }
      setOrders((prev) => prev.filter((o) => o._id !== orderToDelete));
      setError(null);
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
    } catch (e) {
      setError(e?.message || "Network error.");
      setDeleteConfirmOpen(false);
    } finally {
      setSavingId(null);
    }
  }

  function updateDraft(name, value) {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#112B54]">Orders</h1>
  
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {!orders.length && !error ? (
        <p className="text-gray-500 text-sm">No orders yet.</p>
      ) : !filteredOrders.length && !!searchQuery ? (
        <p className="text-gray-500 text-sm">
          No orders match "{searchQuery}".
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm min-w-[720px]">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total (PKR)</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o._id} className="border-t border-gray-100 align-top">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {String(o.source || "").replace("_", " ")}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === o._id ? (
                      <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        <input className="w-full rounded border px-2 py-1 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={draft?.fullName || ""} onChange={(e) => updateDraft("fullName", e.target.value)} placeholder="Full name" />
                        <input className="w-full rounded border px-2 py-1 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={draft?.phone || ""} onChange={(e) => updateDraft("phone", e.target.value)} placeholder="Phone" />
                        <input className="w-full rounded border px-2 py-1 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={draft?.email || ""} onChange={(e) => updateDraft("email", e.target.value)} placeholder="Email" />
                        <input className="w-full rounded border px-2 py-1 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={draft?.address || ""} onChange={(e) => updateDraft("address", e.target.value)} placeholder="Address" />
                        <div className="grid grid-cols-2 gap-1">
                          <input className="rounded border px-2 py-1 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={draft?.city || ""} onChange={(e) => updateDraft("city", e.target.value)} placeholder="City" />
                          <input className="rounded border px-2 py-1 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={draft?.country || ""} onChange={(e) => updateDraft("country", e.target.value)} placeholder="Country" />
                        </div>
                        <input className="w-full rounded border px-2 py-1 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={draft?.notes || ""} onChange={(e) => updateDraft("notes", e.target.value)} placeholder="Notes" />
                      </div>
                    ) : (
                      <>
                        <p className="font-medium text-[#112B54]">
                          {o.customer?.fullName || "—"}
                        </p>
                        <p className="text-gray-500">{o.customer?.phone || "—"}</p>
                        <p className="text-gray-500">{o.customer?.email || "—"}</p>
                        <p className="text-gray-500">
                          {[o.customer?.address, o.customer?.city, o.customer?.country]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </p>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize font-medium">
                    COD
                  </td>
                  <td className="px-4 py-3">
                    <ul className="space-y-1">
                      {(o.items || []).map((it, i) => (
                        <li key={i}>
                          <Link
                            to={`/${it.slug}`}
                            className="text-blue-600 hover:underline"
                          >
                            {it.title}
                          </Link>{" "}
                          <span className="text-gray-500">
                            ×{it.quantity} @ {formatPkrFromUsd(it.unitPrice)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPkrFromUsd(o.totalUSD)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingId === o._id ? (
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={openSaveConfirm}
                          disabled={savingId === o._id}
                          className="text-blue-600 hover:text-blue-800 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={() => beginEdit(o)}
                          className="text-blue-600 hover:text-blue-800 transition-all duration-200 cursor-pointer hover:scale-102"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteConfirm(o._id)}
                          disabled={savingId === o._id}
                          className="text-red-600 hover:text-red-800 transition-all duration-200 hover:scale-102 cursor-pointer disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={deleteConfirmOpen}
        title="Confirm delete"
        intent="danger"
        onClose={() => {
          setDeleteConfirmOpen(false);
          setOrderToDelete(null);
        }}
        secondaryAction={{
          label: "No",
          onClick: () => {
            setDeleteConfirmOpen(false);
            setOrderToDelete(null);
          },
        }}
        primaryAction={{
          label: "Yes",
          onClick: confirmDelete,
        }}
      >
        <p className="text-sm text-gray-700">Are you sure you want to delete this order?</p>
      </Modal>

      <Modal
        open={saveConfirmOpen}
        title="Confirm save"
        intent="default"
        onClose={() => setSaveConfirmOpen(false)}
        secondaryAction={{
          label: "No",
          onClick: () => setSaveConfirmOpen(false),
        }}
        primaryAction={{
          label: "Yes",
          onClick: confirmSave,
        }}
      >
        <p className="text-sm text-gray-700">Are you sure you want to save these changes?</p>
      </Modal>
    </div>
  );
}
