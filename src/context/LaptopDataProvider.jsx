import { useCallback, useEffect, useState } from "react";
import { LaptopDataContext } from "./laptop-data-context.js";
import { API_BASE } from "../config/api.js";

const CACHE_KEY = "orakitech-home-cache";
const CACHE_TTL_MS = 2 * 60 * 1000;

function readCachedListings() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data)) return null;
    if (Date.now() - Number(parsed.timestamp || 0) > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCachedListings(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    /* ignore */
  }
}

export function LaptopDataProvider({ children }) {
  const [laptopData, setLaptopData] = useState(() => readCachedListings() || []);
  const [loading, setLoading] = useState(() => !readCachedListings());
  const [error, setError] = useState(null);

  const refreshLaptopData = useCallback(async (opts = {}) => {
    const { silent } = opts;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/home`);
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setLaptopData([]);
        setError(
          typeof data?.message === "string"
            ? data.message
            : "Could not load products."
        );
        return;
      }
      const next = Array.isArray(data) ? data : [];
      setLaptopData(next);
      writeCachedListings(next);
    } catch (e) {
      setLaptopData([]);
      setError(e?.message || "Network error loading products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = readCachedListings();
    refreshLaptopData({ silent: Boolean(cached?.length) });
  }, [refreshLaptopData]);

  const value = {
    laptopData,
    setLaptopData,
    refreshLaptopData,
    loading,
    error,
  };

  return (
    <LaptopDataContext.Provider value={value}>
      {children}
    </LaptopDataContext.Provider>
  );
}
