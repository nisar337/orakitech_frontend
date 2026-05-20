import { useCallback, useEffect, useMemo, useState } from "react";
import { UserAuthContext } from "./user-auth-context.js";
import { API_BASE } from "../config/api.js";

const USER_CACHE_KEY = "orakitech_user";

function loadCachedUser() {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  try {
    if (user) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_CACHE_KEY);
  } catch {}
}

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(() => loadCachedUser());
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
        persistUser(data.user);
      } else {
        setUser(null);
        persistUser(null);
      }
    } catch {
      // Network error (e.g. server sleeping) — keep the cached user, don't auto-logout
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.message || "Could not send OTP.";
      setStatus(message);
      return { ok: false, message };
    }
    setStatus("");
    return { ok: true };
  }, []);

  const verifyResetOtp = useCallback(async ({ email, otp }) => {
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.message || "OTP verification failed.";
      setStatus(message);
      return { ok: false, message };
    }
    setStatus("");
    return { ok: true, token: data?.token };
  }, []);

  const resetPassword = useCallback(async ({ token, password }) => {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.message || "Password reset failed.";
      setStatus(message);
      return { ok: false, message };
    }
    if (data?.user) {
      setUser(data.user);
      persistUser(data.user);
    }
    setStatus("");
    return { ok: true };
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const register = useCallback(async ({ name, email, password, phone }) => {
    const res = await fetch(`${API_BASE}/api/auth/register-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.message || "Could not start registration.";
      setStatus(message);
      return { ok: false, message };
    }
    setStatus("");
    return { ok: true, email: data?.email || email };
  }, []);

  const verifyRegistrationOtp = useCallback(async ({ email, otp }) => {
    const res = await fetch(`${API_BASE}/api/auth/verify-registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.message || "OTP verification failed.";
      setStatus(message);
      return { ok: false, message };
    }
    if (data?.user) {
      setUser(data.user);
      persistUser(data.user);
    }
    setStatus("");
    return { ok: true, user: data?.user || null };
  }, []);

  const resendRegistrationOtp = useCallback(async (email) => {
    const res = await fetch(`${API_BASE}/api/auth/resend-register-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.message || "Could not resend OTP.";
      setStatus(message);
      return { ok: false, message };
    }
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
    persistUser(data.user || null);
    setStatus("");
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API_BASE}/api/auth/user/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => null);
    setUser(null);
    persistUser(null);
    setStatus("");
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      loading,
      isLoggedIn: Boolean(user),
      register,
      verifyRegistrationOtp,
      resendRegistrationOtp,
      login,
      logout,
      requestPasswordReset,
      verifyResetOtp,
      resetPassword,
      refreshSession: fetchSession,
    }),
    [
      user,
      status,
      loading,
      register,
      verifyRegistrationOtp,
      resendRegistrationOtp,
      login,
      logout,
      requestPasswordReset,
      verifyResetOtp,
      resetPassword,
      fetchSession,
    ]
  );

  return (
    <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
  );
}
