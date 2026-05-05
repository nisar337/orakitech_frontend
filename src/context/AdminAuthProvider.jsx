import { useCallback, useEffect, useMemo, useState } from "react";
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
      email: user?.email || "",
      avatarUrl: user?.avatarUrl || "",
      role: user?.role || "",
      isPrimary: Boolean(user?.isPrimary),
    };
  } catch {
    return {
      token: "",
      username: "",
      fullName: "",
      email: "",
      avatarUrl: "",
      role: "",
      isPrimary: false,
    };
  }
}

export function AdminAuthProvider({ children }) {
  const initial = readSession();
  const [token, setToken] = useState(initial.token);
  const [username, setUsername] = useState(initial.username);
  const [fullName, setFullName] = useState(initial.fullName);
  const [email, setEmail] = useState(initial.email);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [role, setRole] = useState(initial.role);
  const [isPrimary, setIsPrimary] = useState(initial.isPrimary);

  const persistSession = useCallback((nextToken, user) => {
    setToken(nextToken);
    setUsername(user?.username || "");
    setFullName(user?.fullName || "");
    setEmail(user?.email || "");
    setAvatarUrl(user?.avatarUrl || "");
    setRole(user?.role || (user?.isPrimary ? "Primary Admin" : "Admin"));
    setIsPrimary(Boolean(user?.isPrimary));
    try {
      if (nextToken) {
        sessionStorage.setItem(TOKEN_KEY, nextToken);
        sessionStorage.setItem(
          USER_KEY,
          JSON.stringify({
            username: user?.username || "",
            fullName: user?.fullName || "",
            email: user?.email || "",
            avatarUrl: user?.avatarUrl || "",
            role: user?.role || "",
            isPrimary: Boolean(user?.isPrimary),
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

  const refreshMe = useCallback(async () => {
    if (!token) return;
    try {
      const res = await adminFetch(`${API_BASE}/api/auth/admin/me`);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.user) {
        persistSession(token, data.user);
      }
    } catch {
      /* ignore */
    }
  }, [adminFetch, persistSession, token]);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

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

  const updateUser = useCallback(
    (partial) => {
      if (!token) return;
      persistSession(token, {
        username,
        fullName,
        email,
        avatarUrl,
        role,
        isPrimary,
        ...(partial || {}),
      });
    },
    [token, persistSession, username, fullName, email, avatarUrl, role, isPrimary]
  );

  const logout = useCallback(() => {
    persistSession("", null);
  }, [persistSession]);

  const value = useMemo(
    () => ({
      token,
      username,
      fullName,
      email,
      avatarUrl,
      role: role || (isPrimary ? "Primary Admin" : "Admin"),
      isPrimary,
      displayName: fullName || username || "Admin",
      isLoggedIn: Boolean(token),
      login,
      logout,
      adminFetch,
      refreshMe,
      updateUser,
    }),
    [
      token,
      username,
      fullName,
      email,
      avatarUrl,
      role,
      isPrimary,
      login,
      logout,
      adminFetch,
      refreshMe,
      updateUser,
    ]
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}
