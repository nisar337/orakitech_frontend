import { useCallback, useEffect, useMemo, useState } from "react";
import { UserAuthContext } from "./user-auth-context.js";
import { API_BASE } from "../config/api.js";

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/user/session`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const register = useCallback(async ({ name, email, password, phone }) => {
    const res = await fetch(`${API_BASE}/api/auth/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.message || "Could not register.";
      setStatus(message);
      return { ok: false, message };
    }
    setUser(data.user || null);
    setStatus("");
    return { ok: true };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/api/auth/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.message || "Could not login.";
      setStatus(message);
      return { ok: false, message };
    }
    setUser(data.user || null);
    setStatus("");
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API_BASE}/api/auth/user/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => null);
    setUser(null);
    setStatus("");
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      loading,
      isLoggedIn: Boolean(user),
      register,
      login,
      logout,
      refreshSession: fetchSession,
    }),
    [user, status, loading, register, login, logout, fetchSession]
  );

  return (
    <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
  );
}
