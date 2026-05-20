import { FaCircleUser, FaChevronDown, FaUser } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth.js";
import PasswordInput from "../ui/PasswordInput.jsx";

export default function Auth() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    user,
    login,
    register,
    logout,
    status,
    loading,
    requestPasswordReset,
    verifyResetOtp,
    resetPassword,
    verifyRegistrationOtp,
    resendRegistrationOtp,
  } = useUserAuth();
  const [mode, setMode] = useState("login");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerStep, setRegisterStep] = useState("form");
  const [registerOtp, setRegisterOtp] = useState("");
  const [registerCountdown, setRegisterCountdown] = useState(0);
  const [pendingRegisterEmail, setPendingRegisterEmail] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerRedirecting, setRegisterRedirecting] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotCountdown, setForgotCountdown] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!showForgot || forgotStep !== "otp" || forgotCountdown <= 0) return;
    const timer = setTimeout(() => setForgotCountdown((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [showForgot, forgotStep, forgotCountdown]);

  useEffect(() => {
    if (registerStep !== "otp" || registerCountdown <= 0) return;
    const timer = setTimeout(() => setRegisterCountdown((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [registerStep, registerCountdown]);

  async function submit(e) {
    e.preventDefault();
    setLocalStatus("");
    if (showForgot) {
      if (forgotStep === "email") {
        setActionLoading(true);
        try {
          const result = await requestPasswordReset(forgotEmail || email);
          if (result.ok) {
            setForgotStep("otp");
            setForgotCountdown(60);
          }
        } finally {
          setActionLoading(false);
        }
        return;
      }
      if (forgotStep === "otp") {
        setActionLoading(true);
        try {
          const result = await verifyResetOtp({
            email: forgotEmail || email,
            otp: forgotOtp,
          });
          if (result.ok) {
            setResetToken(result.token);
            setForgotStep("reset");
          }
        } finally {
          setActionLoading(false);
        }
        return;
      }
      if (forgotStep === "reset") {
        if (newPassword !== confirmNewPassword) {
          setLocalStatus("Passwords do not match.");
          return;
        }
        setActionLoading(true);
        try {
          const result = await resetPassword({ token: resetToken, password: newPassword });
          if (result.ok) {
            setShowForgot(false);
            setForgotStep("email");
            setForgotEmail("");
            setForgotOtp("");
            setResetToken("");
            setNewPassword("");
            setConfirmNewPassword("");
            setForgotCountdown(0);
          }
        } finally {
          setActionLoading(false);
        }
        return;
      }
    }
    if (mode === "register") {
      if (registerStep === "otp") {
        setActionLoading(true);
        try {
          const result = await verifyRegistrationOtp({
            email: pendingRegisterEmail || email,
            otp: registerOtp,
          });
          if (result.ok) {
            setRegisterSuccess(true);
            setRegisterStep("success");
            setRegisterOtp("");
            setRegisterCountdown(0);
            setPendingRegisterEmail("");
            setRegisterRedirecting(true);
            setMode("login");
            setTimeout(() => {
              setRegisterRedirecting(false);
              setOpen(false);
              navigate("/");
            }, 1200);
          }
        } finally {
          setActionLoading(false);
        }
        return;
      }
      if (password !== confirmPassword) {
        setLocalStatus("Password and confirm password must match.");
        return;
      }
      setActionLoading(true);
      try {
        const result = await register({ name, email, password, phone });
        if (result.ok) {
          setPendingRegisterEmail(result.email || email);
          setRegisterStep("otp");
          setRegisterCountdown(60);
          setRegisterOtp("");
          setRegisterSuccess(false);
        }
      } finally {
        setActionLoading(false);
      }
      return;
    }
    setActionLoading(true);
    try {
      const result = await login({ email, password });
      if (result.ok) setOpen(false);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="relative flex items-center">
      {!isLoggedIn ? (
        <div ref={formRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setShowForgot(false);
              setRegisterStep("form");
              setRegisterOtp("");
              setRegisterCountdown(0);
              setPendingRegisterEmail("");
              setRegisterSuccess(false);
              setForgotStep("email");
              setForgotEmail("");
              setForgotOtp("");
              setResetToken("");
              setNewPassword("");
              setConfirmNewPassword("");
              setForgotCountdown(0);
              setOpen((v) => !v);
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm transition-colors duration-200 hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-0"
            title="Login / Sign In"
          >
            <FaUser className="text-base text-blue-300" />
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
              {showForgot
                ? forgotStep === "email"
                  ? "Forgot Password"
                  : forgotStep === "otp"
                    ? "Verify OTP"
                    : "Reset Password"
                : mode === "register"
                  ? registerStep === "otp"
                    ? "Verify OTP"
                    : registerStep === "success"
                      ? "Verified"
                    : "Create Account"
                  : "Sign In"}
            </h3>

            {registerSuccess && !showForgot ? (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                OTP Verified successfully. Redirecting to home...
              </div>
            ) : null}

            {showForgot ? (
              <>
                {forgotStep === "email" ? (
                  <>
                    <label className="mb-1 block text-left text-sm font-medium text-black">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Email Address"
                      className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                      required
                    />
                  </>
                ) : null}
                {forgotStep === "otp" ? (
                  <>
                    <p className="mb-2 text-xs text-slate-600">
                      We sent a 6-digit code to <strong>{forgotEmail || email}</strong>.
                    </p>
                    <label className="mb-1 block text-left text-sm font-medium text-black">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) =>
                        setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="Enter 6-digit code"
                      className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                      required
                    />
                    <div className="mb-3 flex items-center justify-between text-xs text-slate-600">
                      <button
                        type="button"
                        disabled={forgotCountdown > 0}
                        onClick={async () => {
                          const result = await requestPasswordReset(forgotEmail || email);
                          if (result.ok) setForgotCountdown(60);
                        }}
                        className="font-semibold text-[#10295A] disabled:opacity-50 focus:outline-none focus:ring-0 cursor-pointer"
                      >
                        {forgotCountdown > 0
                          ? `Resend in ${forgotCountdown}s`
                          : "Resend OTP"}
                      </button>
                    </div>
                  </>
                ) : null}
                {forgotStep === "reset" ? (
                  <>
                    <label className="mb-1 block text-left text-sm font-medium text-black">
                      New Password
                    </label>
                    <PasswordInput
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                      required
                    />
                    <label className="mb-1 block text-left text-sm font-medium text-black">
                      Confirm Password
                    </label>
                    <PasswordInput
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                      required
                    />
                  </>
                ) : null}
              </>
            ) : (
              <>
                {mode === "register" && registerStep !== "otp" && registerStep !== "success" ? (
                  <>
                    <label className="mb-1 block text-left text-sm font-medium text-black">
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
                {mode === "register" && registerStep === "otp" ? (
                  <>
                    <p className="mb-2 text-xs text-slate-600">
                      We sent a 6-digit code to <strong>{pendingRegisterEmail || email}</strong>.
                    </p>
                    <label className="mb-1 block text-left text-sm font-medium text-black">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={registerOtp}
                      onChange={(e) =>
                        setRegisterOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="Enter 6-digit code"
                      className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                      required
                    />
                    <div className="mb-3 flex items-center justify-between text-xs text-slate-600">
                      <button
                        type="button"
                        disabled={registerCountdown > 0}
                        onClick={async () => {
                          const result = await resendRegistrationOtp(
                            pendingRegisterEmail || email
                          );
                          if (result.ok) setRegisterCountdown(60);
                        }}
                        className="font-semibold text-[#10295A] disabled:opacity-50 focus:outline-none focus:ring-0 cursor-pointer"
                      >
                        {registerCountdown > 0
                          ? `Resend in ${registerCountdown}s`
                          : "Resend OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRegisterStep("form");
                          setRegisterOtp("");
                          setRegisterCountdown(0);
                        }}
                        className="text-slate-500 underline focus:outline-none focus:ring-0 cursor-pointer"
                      >
                        Edit details
                      </button>
                    </div>
                  </>
                ) : registerStep === "success" ? null : (
                  <>
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
                  </>
                )}
                {mode === "register" && registerStep !== "otp" ? (
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
                {mode !== "register" ? (
                  <>
                    <label className="mb-1 block text-left text-sm font-medium text-black">
                      Password
                    </label>
                    <PasswordInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                      required
                    />
                  </>
                ) : null}
                {mode === "register" && registerStep !== "otp" ? (
                  <>
                    <label className="mb-1 block text-left text-sm font-medium text-black">
                      Password
                    </label>
                    <PasswordInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="mb-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                      required
                    />
                  </>
                ) : null}
                {mode === "register" && registerStep !== "otp" ? (
                  <>
                    <label className="mb-1 block text-left text-sm font-medium text-black">
                      Confirm Password
                    </label>
                    <PasswordInput
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
              </>
            )}
            {localStatus || status ? (
              <p className="mb-2 text-xs text-rose-500">{localStatus || status}</p>
            ) : null}
            <button
              type="submit"
              disabled={loading || actionLoading || registerRedirecting}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#10295A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0b1f46] disabled:opacity-70 focus:outline-none focus:ring-0"
            >
              {loading || actionLoading || registerRedirecting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span>
                    {showForgot && forgotStep === "email"
                      ? "Sending OTP..."
                      : mode === "register" && registerStep === "form"
                        ? "Sending OTP..."
                        : registerStep === "success"
                          ? "Redirecting..."
                        : "Processing..."}
                  </span>
                </span>
              ) : showForgot ? (
                forgotStep === "email" ? (
                  "Send OTP"
                ) : forgotStep === "otp" ? (
                  "Verify OTP"
                ) : (
                  "Reset Password"
                )
              ) : mode === "register" && registerStep === "otp" ? (
                "Verify OTP"
              ) : mode === "register" && registerStep === "success" ? (
                "Redirecting..."
              ) : mode === "register" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>

            {showForgot ? (
              <p className="mt-3 text-center text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setForgotStep("email");
                    setForgotEmail("");
                    setForgotOtp("");
                    setResetToken("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setForgotCountdown(0);
                  }}
                  className="font-semibold text-[#10295A] underline transition-opacity duration-200 hover:opacity-80 focus:outline-none focus:ring-0 cursor-pointer"
                >
                  Back to sign in
                </button>
              </p>
            ) : (
              <>
                {mode === "login" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setForgotStep("email");
                      setForgotEmail(email);
                      setLocalStatus("");
                    }}
                    className="mt-3 block w-full cursor-pointer text-center text-xs font-semibold text-[#10295A] underline focus:outline-none focus:ring-0"
                  >
                    Forgot password?
                  </button>
                ) : null}
                <p className="mt-3 text-center text-xs text-slate-600">
                  {mode === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      const nextMode = mode === "register" ? "login" : "register";
                      setMode(nextMode);
                      if (nextMode === "register") {
                        setRegisterSuccess(false);
                      } else {
                        setRegisterStep("form");
                        setRegisterOtp("");
                        setRegisterCountdown(0);
                        setPendingRegisterEmail("");
                        setRegisterRedirecting(false);
                      }
                    }}
                    className="font-semibold text-[#10295A] underline transition-opacity duration-200 hover:opacity-80 focus:outline-none focus:ring-0 cursor-pointer"
                  >
                    {mode === "register" ? "Sign in" : "Create account"}
                  </button>
                </p>
              </>
            )}
          </form>
        </div>
      ) : (
        <div 
          className="relative" 
          ref={dropdownRef}
          onMouseEnter={() => setProfileDropdown(true)}
          onMouseLeave={() => setProfileDropdown(false)}
        >
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 transition-colors duration-200 hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-0"
            title="User Menu"
          >
            <FaCircleUser className="text-xl text-blue-300" />
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
                className="w-full cursor-pointer px-4 py-2 text-center text-sm text-rose-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-0"
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
                  className="rounded cursor-pointer border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50 focus:outline-none focus:ring-0"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setConfirmLogout(false);
                  }}
                  className="rounded cursor-pointer bg-[#10295A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0b1f46] focus:outline-none focus:ring-0"
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
