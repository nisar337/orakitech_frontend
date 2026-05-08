import { useEffect, useState } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth.js";
import { API_BASE } from "../../config/api.js";
import { HiTrash } from "react-icons/hi";
import Modal from "../ui/Modal.jsx";

export default function ViewMessages() {
  const { adminFetch } = useAdminAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  async function loadMessages() {
    try {
      const res = await adminFetch(`${API_BASE}/api/contact`);
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setError(data.message || "Could not load messages.");
        setMessages([]);
        return;
      }
      setMessages(Array.isArray(data) ? data : []);
      setError("");
    } catch (e) {
      setError(e?.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function markAsRead(messageId) {
    try {
      const res = await adminFetch(`${API_BASE}/api/contact/${messageId}`, {
        method: "PUT",
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, isRead: true } : m))
        );
      }
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  }

  function openDeleteConfirm(messageId) {
    setMessageToDelete(messageId);
    setDeleteConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!messageToDelete) return;
    setDeletingId(messageToDelete);
    try {
      const res = await adminFetch(`${API_BASE}/api/contact/${messageToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Could not delete message.");
        setDeleteConfirmOpen(false);
        return;
      }
      setMessages((prev) => prev.filter((m) => m._id !== messageToDelete));
      setError("");
      setDeleteConfirmOpen(false);
      setMessageToDelete(null);
    } catch (e) {
      setError(e?.message || "Network error.");
      setDeleteConfirmOpen(false);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#112B54]">Messages</h1>
        <span className="text-sm text-gray-500">
          {messages.filter((m) => !m.isRead).length} unread
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-600">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-gray-600">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`rounded-2xl border p-6 transition-all ${
                msg.isRead
                  ? "bg-white border-gray-200"
                  : "bg-white border-blue-200 shadow-sm"
              }`}
            >
              {/* Header: Avatar + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#112B54]">{msg.name}</h3>
              </div>

              {/* Info Table */}
              <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
                <div className="grid grid-cols-2">
                  <div className="border-b border-r border-gray-200 px-4 py-2.5">
                    <span className="text-sm font-semibold text-gray-700">From:</span>
                    <span className="text-sm text-gray-600 ml-2">{msg.name}</span>
                  </div>
                  <div className="border-b border-gray-200 px-4 py-2.5">
                    <span className="text-sm font-semibold text-gray-700">Phone:</span>
                    <span className="text-sm text-gray-600 ml-2">{msg.phone || "—"}</span>
                  </div>
                  <div className="border-r border-gray-200 px-4 py-2.5">
                    <span className="text-sm font-semibold text-gray-700">Email:</span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-sm text-blue-600 underline ml-2 hover:text-blue-800"
                    >
                      {msg.email}
                    </a>
                  </div>
                  <div className="px-4 py-2.5">
                    <span className="text-sm font-semibold text-gray-700">Subject:</span>
                    <span className="text-sm text-gray-600 ml-2">{msg.subject}</span>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="rounded-xl bg-gray-100 p-4 mb-4">
                <div className="flex gap-2">
                  <span className="text-2xl text-gray-300 leading-none">&ldquo;</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Status: Pending Reply
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openDeleteConfirm(msg._id)}
                    disabled={deletingId === msg._id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <HiTrash className="h-4 w-4" />
                    {deletingId === msg._id ? "Deleting..." : "Delete"}
                  </button>
                  {!msg.isRead && (
                    <button
                      type="button"
                      onClick={() => markAsRead(msg._id)}
                      className="text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={deleteConfirmOpen}
        title="Confirm delete"
        intent="danger"
        onClose={() => {
          setDeleteConfirmOpen(false);
          setMessageToDelete(null);
        }}
        secondaryAction={{
          label: "No",
          onClick: () => {
            setDeleteConfirmOpen(false);
            setMessageToDelete(null);
          },
        }}
        primaryAction={{
          label: "Yes",
          onClick: confirmDelete,
        }}
      >
        <p className="text-sm text-gray-700">Are you sure you want to delete this message?</p>
      </Modal>
    </div>
  );
}
