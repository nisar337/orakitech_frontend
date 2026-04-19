import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductsTable from "./ProductsTable";

export default function AdminProducts() {
  const location = useLocation();
  const [notice, setNotice] = useState("");
  const seenKey = useRef("");

  useEffect(() => {
    const raw = location.state?.notice;
    if (typeof raw !== "string" || !raw.trim()) return;
    const token = `${location.key}:${raw}`;
    if (token === seenKey.current) return;
    seenKey.current = token;
    setNotice(raw.trim());
  }, [location.key, location.state?.notice]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 6500);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#112B54]">All products</h1>
      {notice ? (
        <p
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-900 shadow-sm"
          role="status"
        >
          {notice}
        </p>
      ) : null}
      <p className="text-gray-600 text-sm">
        Manage listings from your storefront. Deleting here removes the item
        from the public catalog immediately.
      </p>
      <ProductsTable />
    </div>
  );
}
