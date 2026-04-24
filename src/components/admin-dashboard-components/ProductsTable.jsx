import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLaptopData } from "../../hooks/useLaptopData.js";
import { useAdminAuth } from "../../hooks/useAdminAuth.js";
import { API_BASE } from "../../config/api.js";
import { formatPkrFromUsd } from "../../utils/currency.js";
import { matchesProductSearch } from "../../utils/adminSearch.js";

export default function ProductsTable() {
  const { adminFetch } = useAdminAuth();
  const { laptopData, refreshLaptopData } = useLaptopData();
  const [searchParams] = useSearchParams();
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageKind, setMessageKind] = useState("error");

  const searchQuery = String(searchParams.get("search") || "").trim();

  const filteredProducts = useMemo(
    () => laptopData.filter((product) => matchesProductSearch(product, searchQuery)),
    [laptopData, searchQuery]
  );

  useEffect(() => {
    if (!message || messageKind !== "success") return;
    const t = setTimeout(() => {
      setMessage(null);
    }, 5000);
    return () => clearTimeout(t);
  }, [message, messageKind]);

  async function handleDelete(id) {
    if (!id || !window.confirm("Delete this product from the store?")) return;
    setMessage(null);
    setDeletingId(id);
    try {
      const res = await adminFetch(`${API_BASE}/api/listings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessageKind("error");
        setMessage(data.message || "Delete failed.");
        return;
      }
      await refreshLaptopData();
      setMessageKind("success");
      setMessage("Product deleted successfully.");
    } catch (e) {
      setMessageKind("error");
      setMessage(e?.message || "Network error.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="font-semibold mb-4">Latest products</h2>
      {message && (
        <p
          className={`mb-3 rounded-lg border px-3 py-2 text-sm font-medium ${
            messageKind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role="alert"
        >
          {message}
        </p>
      )}

      {!laptopData.length ? (
        <p className="text-gray-500 text-sm">No products yet. Add one from Add product.</p>
      ) : !filteredProducts.length ? (
        <p className="text-gray-500 text-sm">
          No matching products found for "{searchQuery}".
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="pb-2">Product</th>
                <th className="pb-2">Brand</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Price (PKR)</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id} className="border-t text-sm">
                  <td className="py-2 pr-2">
                    <Link
                      to={`/${p.slug}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-2">{p.brand}</td>
                  <td className="py-2">{p.type}</td>
                  <td className="py-2">{formatPkrFromUsd(p.price)}</td>
                  <td className="py-2">{p.quantity ?? "—"}</td>
                  <td className="py-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.stockStatus === "Out of stock"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {p.stockStatus || "In stock"}
                    </span>
                  </td>
                  <td className="py-2 space-x-3 whitespace-nowrap">
                    <Link
                      to={`/admin/edit/${p._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-red-600 hover:underline disabled:opacity-50"
                      disabled={deletingId === p._id}
                      onClick={() => handleDelete(p._id)}
                    >
                      {deletingId === p._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
