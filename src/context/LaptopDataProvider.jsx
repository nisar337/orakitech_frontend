import { useCallback, useEffect, useState } from "react";
import { LaptopDataContext } from "./laptop-data-context.js";
import { API_BASE } from "../config/api.js";

export function LaptopDataProvider({ children }) {
  const [laptopData, setLaptopData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshLaptopData = useCallback(async () => {
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
      setLaptopData(Array.isArray(data) ? data : []);
    } catch (e) {
      setLaptopData([]);
      setError(e?.message || "Network error loading products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLaptopData();
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
