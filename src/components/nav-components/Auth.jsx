import { BiSolidUser } from "react-icons/bi";
import { useState, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth.js";
import { FaChevronDown } from "react-icons/fa";

export default function Auth() {
  const { isLoggedIn, user, login, register, logout, status, loading } = useUserAuth();
  const [mode, setMode] = useState("login");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localStatus, setLocalStatus] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  async function submit(e) {
    e.preventDefault();
    setLocalStatus("");
    if (mode === "register") {
      if (password !== confirmPassword) {
        setLocalStatus("Password and confirm password must match.");
        return;
      }
      const result = await register({ name, email, password, phone });
      if (result.ok) setOpen(false);
      return;
    }
    const result = await login({ email, password });
    if (result.ok) setOpen(false);
  }

  return (
    <div className="relative flex items-center">
      {!isLoggedIn ? (
        <>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setOpen((v) => !v);
            }}
            className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm transition-colors duration-200 hover:bg-white/20"
            title="Login / Sign In"
          >
            <BiSolidUser className="text-base" />
            <span>Login</span>
          </button>
          <form
            onSubmit={submit}
            className={`absolute right-0 top-12 z-20 w-[360px] origin-top-right rounded-xl bg-white p-5 text-slate-900 shadow-2xl transition-all duration-300 ease-out ${
              open
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-2 scale-95 opacity-0"
            }`}
          >
              <h3 className="mb-4 text-center text-2xl font-bold">
                {mode === "register" ? "Create Account" : "Sign  In"}
              </h3>

              {mode === "register" ? (
                <>
                  <label className="mb-1 block  text-left text-sm font-medium text-black">
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                    required
                    minLength={2}
                  />
                </>
              ) : null}
              <label className="mb-1 block text-left text-sm font-medium text-black">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                required
              />
              {mode === "register" ? (
                <>
                  <label className="mb-1 block text-left text-sm font-medium text-black">
                    Phone Number
                  </label>
                  <div className="mb-2 flex gap-2">
                    <span className="inline-flex items-center rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      +92
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="Phone Number"
                      inputMode="numeric"
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                      required
                      minLength={10}
                      maxLength={10}
                    />
                  </div>
                </>
              ) : null}
              <label className="mb-1 block text-left text-sm font-medium text-black">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                required
              />
              {mode === "register" ? (
                <>
                  <label className="mb-1 block text-left text-sm font-medium text-black">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                    required
                  />
                  <div className="mb-3 flex items-center gap-4 text-xs text-slate-600">
                    <label className="inline-flex items-center gap-1">
                      <input type="checkbox" required />
                      <span>Terms of Service</span>
                    </label>
                    <label className="inline-flex items-center gap-1">
                      <input type="checkbox" required />
                      <span>Privacy Policy</span>
                    </label>
                  </div>
                </>
              ) : null}
              {localStatus || status ? (
                <p className="mb-2 text-xs text-rose-500">{localStatus || status}</p>
              ) : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#10295A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0b1f46] disabled:opacity-70"
              >
                {mode === "register" ? "Create Account" : "Sign In"}
              </button>

              <p className="mt-3 text-center text-xs text-slate-600">
                {mode === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "register" ? "login" : "register")}
                  className="font-semibold text-[#10295A] underline transition-opacity duration-200 hover:opacity-80"
                >
                  [{mode === "register" ? "Sign in" : "Create account"}]
                </button>
              </p>

            </form>
        </>
      ) : (
        <div 
          className="relative" 
          ref={dropdownRef}
          onMouseEnter={() => setProfileDropdown(true)}
          onMouseLeave={() => setProfileDropdown(false)}
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 p-2 transition-colors duration-200 hover:bg-white/20"
            title="User Menu"
          >
            <BiSolidUser className="text-lg" />
            <FaChevronDown className={`text-xs transition-transform duration-300 ${profileDropdown ? 'rotate-180' : ''}`} />
          </button>

          <div className={`absolute right-0 top-8 z-30 w-30 origin-top-right rounded-lg border border-slate-200 bg-white text-slate-900 shadow-xl transition-all duration-300 ease-out ${
            profileDropdown 
              ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' 
              : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
          }`}>
            <div className="border-b border-slate-200 px-4 py-3">
              <p className="truncate text-sm font-semibold">{user?.name || "User"}</p>
        
            </div>
            <div>
              <Link
                to="/account"
                onClick={() => setProfileDropdown(false)}
                className="block px-4 py-0 text-sm text-slate-700 transition-colors hover:bg-slate-100"
              >
                View Profile
              </Link>
              <Link
                to="/account/edit"
                onClick={() => setProfileDropdown(false)}
                className="block px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
              >
                Edit Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setProfileDropdown(false);
                  setConfirmLogout(true);
                }}
                className="w-full px-4 py-2 text-center cursor-pointer text-sm text-rose-600 transition-colors hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          </div>

          {confirmLogout ? (
            <div className="absolute cursor-pointer right-0 top-12 z-40 w-60 rounded-lg border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
              <p className="mb-3 text-sm font-medium">Are you sure you want to logout?</p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmLogout(false)}
                  className="rounded border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setConfirmLogout(false);
                  }}
                  className="rounded bg-[#10295A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0b1f46]"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
