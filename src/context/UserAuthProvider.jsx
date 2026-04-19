import { useMemo, useState } from "react";
import { UserAuthContext } from "./user-auth-context.js";

const STORAGE_KEY = "oraki-user-google-profile";

function readStoredProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredProfile());
  const [status, setStatus] = useState("");
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const googleConfigured = /\.apps\.googleusercontent\.com$/.test(
    String(googleClientId).trim()
  );

  function loadGoogleScript() {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) {
        resolve();
        return;
      }
      const existing = document.getElementById("google-identity-script");
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Script load failed.")), {
          once: true,
        });
        return;
      }
      const script = document.createElement("script");
      script.id = "google-identity-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Script load failed."));
      document.body.appendChild(script);
    });
  }

  async function applyGoogleToken(accessToken) {
    try {
      setStatus("");
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const profile = await res.json();
      if (!profile?.sub) {
        setStatus("Google login failed. Try again.");
        return;
      }
      const userProfile = {
        id: profile.sub,
        name: profile.name || "",
        email: profile.email || "",
        image: profile.picture || "",
      };
      setUser(userProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      setStatus(e?.message || "Google login failed.");
    }
  }

  async function loginWithGoogle() {
    if (!googleConfigured) {
      return;
    }
    try {
      await loadGoogleScript();
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "openid profile email",
        callback: (response) => {
          if (!response?.access_token) {
            setStatus("Google login cancelled or failed.");
            return;
          }
          applyGoogleToken(response.access_token);
        },
      });
      tokenClient.requestAccessToken();
    } catch (e) {
      setStatus(e?.message || "Unable to start Google login.");
    }
  }

  function logout() {
    setUser(null);
    setStatus("");
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({
      user,
      status,
      isLoggedIn: Boolean(user),
      loginWithGoogle,
      logout,
    }),
    [user, status]
  );

  return (
    <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
  );
}
