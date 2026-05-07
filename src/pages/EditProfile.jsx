import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api.js";
import { useUserAuth } from "../hooks/useUserAuth.js";

export default function EditProfile() {
  const { user, isLoggedIn, loading: authLoading, refreshSession } = useUserAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState({ loading: false, message: "", success: false });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setState({ loading: true, message: "", success: false });

    if (newPassword && newPassword !== confirmPassword) {
      setState({
        loading: false,
        message: "New password and confirm password do not match.",
        success: false,
      });
      return;
    }

    try {
      const body = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      };

      if (currentPassword && newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      const res = await fetch(`${API_BASE}/api/auth/user/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState({
          loading: false,
          message: data?.message || "Failed to update profile.",
          success: false,
        });
        return;
      }

      setState({
        loading: false,
        message: "Profile updated successfully!",
        success: true,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      await refreshSession();

      setTimeout(() => {
        navigate("/account");
      }, 1500);
    } catch (err) {
      setState({
        loading: false,
        message: err?.message || "Failed to update profile.",
        success: false,
      });
    }
  }

  if (authLoading) {
    return <main className="mx-auto max-w-7xl px-4 py-8">Loading...</main>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 animate-fadeIn">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-slideUp">
        <h1 className="mb-2 text-xl font-semibold text-slate-900">Edit Profile</h1>
        <p className="mb-4 text-sm text-slate-600">
          Update your personal information and password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
              required
              minLength={2}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-900">
              Phone Number
            </label>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                +92
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
                placeholder="3001234567"
                inputMode="numeric"
                required
                minLength={10}
                maxLength={10}
              />
            </div>
          </div>

          <hr className="my-4 border-slate-200" />

          <div>
            <h2 className="mb-2 text-base font-semibold text-slate-900">
              Change Password (Optional)
            </h2>
            <p className="mb-3 text-xs text-slate-600">
              Leave blank if you don't want to change your password
            </p>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
                  minLength={6}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
                  minLength={6}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-[#12366A] focus:ring-2 focus:ring-[#12366A]/20"
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {state.message ? (
            <div
              className={`rounded-lg px-4 py-3 text-sm transition-all duration-300 ${
                state.success
                  ? "bg-green-50 text-green-800"
                  : "bg-rose-50 text-rose-800"
              }`}
            >
              {state.message}
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={state.loading}
              className="rounded-lg bg-[#12366A] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0d1f3d] disabled:opacity-50"
            >
              {state.loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/account")}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
