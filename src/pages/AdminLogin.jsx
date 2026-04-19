import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth.js";
import { API_BASE } from "../config/api.js";

export default function AdminLogin() {
  const { isLoggedIn, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const goTo = location.state?.from?.pathname || "/admin";

  const [apiState, setApiState] = useState({
    loading: true,
    needsSetup: false,
    apiError: "",
  });

  const [form, setForm] = useState({ username: "", password: "" });
  const [setup, setSetup] = useState({
    username: "",
    password: "",
    confirm: "",
    fullName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [postSetupHint, setPostSetupHint] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/admin/status`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setApiState({
            loading: false,
            needsSetup: false,
            apiError: data.message || "Could not load admin status from the API.",
          });
          return;
        }
        setApiState({
          loading: false,
          needsSetup: Boolean(data.needsSetup),
          apiError: "",
        });
      } catch {
        if (!cancelled) {
          setApiState({
            loading: false,
            needsSetup: false,
            apiError: "Network error — is the backend running?",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoggedIn) return <Navigate to="/admin" replace />;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function onSetupChange(e) {
    const { name, value } = e.target;
    setSetup((s) => ({ ...s, [name]: value }));
  }

  async function onSubmitLogin(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await login(form.username, form.password);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      navigate(goTo, {
        replace: true,
        state: { adminFlash: "Signed in successfully." },
      });
    } finally {
      setBusy(false);
    }
  }

  async function onSubmitSetup(e) {
    e.preventDefault();
    setError("");
    if (setup.password !== setup.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/admin/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: setup.username,
          password: setup.password,
          fullName: setup.fullName,
          email: setup.email,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Could not create admin.");
        return;
      }
      setApiState((s) => ({ ...s, needsSetup: false }));
      setForm({
        username: setup.username.trim(),
        password: setup.password,
      });
      setError("");
      setSetup({
        username: "",
        password: "",
        confirm: "",
        fullName: "",
        email: "",
      });
      setPostSetupHint(data.message || "Admin created. Sign in below.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-[#0f2140] to-[#112B54] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-white/10">
        {apiState.loading ? (
          <p className="text-center text-gray-600">Loading…</p>
        ) : apiState.apiError ? (
          <div>
            <h1 className="text-2xl font-bold text-[#112B54]">Admin</h1>
            <p className="mt-2 text-sm text-red-700">{apiState.apiError}</p>
          </div>
        ) : apiState.needsSetup ? (
          <form onSubmit={onSubmitSetup}>
            <h1 className="text-3xl font-bold text-[#112B54]">Create first admin</h1>
            <p className="text-sm text-gray-600 mt-1 mb-6">
              No admin exists in the database yet. This form runs once. Choose a
              strong password (8+ characters).{" "}
              <code className="rounded bg-gray-100 px-1 text-xs">ADMIN_JWT_SECRET</code>{" "}
              must be set in <code className="rounded bg-gray-100 px-1 text-xs">backend/.env</code>.
            </p>
            {error ? (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <label className="text-sm text-gray-700">Username</label>
            <input
              name="username"
              value={setup.username}
              onChange={onSetupChange}
              autoComplete="username"
              className="mt-1 mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#112B54]"
              required
            />
            <label className="text-sm text-gray-700">Full name (optional)</label>
            <input
              name="fullName"
              value={setup.fullName}
              onChange={onSetupChange}
              className="mt-1 mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#112B54]"
            />
            <label className="text-sm text-gray-700">Email (optional)</label>
            <input
              name="email"
              type="email"
              value={setup.email}
              onChange={onSetupChange}
              className="mt-1 mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#112B54]"
            />
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={setup.password}
              onChange={onSetupChange}
              autoComplete="new-password"
              className="mt-1 mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#112B54]"
              required
              minLength={8}
            />
            <label className="text-sm text-gray-700">Confirm password</label>
            <input
              type="password"
              name="confirm"
              value={setup.confirm}
              onChange={onSetupChange}
              autoComplete="new-password"
              className="mt-1 mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#112B54]"
              required
              minLength={8}
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-[#112B54] px-4 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Creating…" : "Create admin account"}
            </button>
          </form>
        ) : (
          <form onSubmit={onSubmitLogin}>
            <h1 className="text-3xl font-bold text-[#112B54]">Admin sign in</h1>
            {postSetupHint ? (
              <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {postSetupHint}
              </p>
            ) : null}
            <p className="text-sm text-gray-600 mt-1 mb-6">
              Credentials are checked against the{" "}
              <strong>Admin</strong> collection in MongoDB (password is stored
              hashed). Session uses a JWT signed with{" "}
              <code className="rounded bg-gray-100 px-1 text-xs">ADMIN_JWT_SECRET</code>.
            </p>
            {error ? (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <label className="text-sm text-gray-700">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              autoComplete="username"
              className="mt-1 mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#112B54]"
            />
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#112B54]"
            />
            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-xl bg-[#112B54] px-4 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
