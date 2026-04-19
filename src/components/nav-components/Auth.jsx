import { BiSolidUser } from "react-icons/bi";
import { useUserAuth } from "../../hooks/useUserAuth.js";

export default function Auth() {
  const { isLoggedIn, user, loginWithGoogle, logout } = useUserAuth();
  const googleEnabled = /\.apps\.googleusercontent\.com$/.test(
    String(import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim()
  );

  return (
    <div className="relative flex items-center">
      {!isLoggedIn ? (
        <button
          type="button"
          onClick={() => {
            if (!googleEnabled) return;
            loginWithGoogle();
          }}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 hover:bg-white/20"
          title="Login with Google"
        >
          <BiSolidUser className="text-2xl" />
          <span className="text-sm">Login</span>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <img
            src={user.image || "https://i.pravatar.cc/40"}
            alt={user.name || "User"}
            className="h-9 w-9 rounded-full border border-white/30"
          />
          <div className="hidden md:block text-sm leading-tight">
            <p className="max-w-32 truncate">{user.name || "Google User"}</p>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-amber-300 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
