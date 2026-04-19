import { useCallback, useMemo, useState } from "react";
import { AdminAuthContext } from "./admin-auth-context.js";
import { API_BASE } from "../config/api.js";

const TOKEN_KEY = "orakitech-admin-jwt";
const USER_KEY = "orakitech-admin-user";

function readSession() {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY) || "";
    const raw = sessionStorage.getItem(USER_KEY);
    const user = raw ? JSON.parse(raw) : null;
    return {
      token,
      username: user?.username || "",
      fullName: user?.fullName || "",
    };
  } catch {
    return { token: "", username: "", fullName: "" };
  }
}

export function AdminAuthProvider({ children }) {
  const initial = readSession();
  const [token, setToken] = useState(initial.token);
  const [username, setUsername] = useState(initial.username);
  const [fullName, setFullName] = useState(initial.fullName);

  const persistSession = useCallback((nextToken, user) => {
    setToken(nextToken);
    setUsername(user?.username || "");
    setFullName(user?.fullName || "");
    try {
      if (nextToken) {
        sessionStorage.setItem(TOKEN_KEY, nextToken);
        sessionStorage.setItem(
          USER_KEY,
          JSON.stringify({
            username: user?.username || "",
            fullName: user?.fullName || "",
          })
        );
      } else {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const adminFetch = useCallback(
    async (url, init = {}) => {
      const headers = new Headers(init.headers);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return fetch(url, { ...init, headers });
    },
    [token]
  );

  const login = useCallback(
    async (user, pass) => {
      const res = await fetch(`${API_BASE}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: String(user || "").trim(),
          password: String(pass || ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          ok: false,
          message: data.message || "Login failed.",
        };
      }
      if (!data.token) {
        return { ok: false, message: "Invalid server response." };
      }
      persistSession(data.token, data.user);
      return { ok: true };
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    persistSession("", null);
  }, [persistSession]);

  const value = useMemo(
    () => ({
      token,
      username,
      fullName,
      displayName: fullName || username || "Admin",
      isLoggedIn: Boolean(token),
      login,
      logout,
      adminFetch,
    }),
    [token, username, fullName, login, logout, adminFetch]
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}
