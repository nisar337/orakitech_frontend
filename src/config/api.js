/**
 * Base URL for the Express API (no trailing slash, no trailing /api).
 * In Vite dev, defaults to "" so requests use /api/... and the dev server proxy
 * forwards them to http://localhost:3002.
 *
 * Set VITE_API_URL if the API is elsewhere, e.g. https://my-api.com
 * (not https://my-api.com/api — paths already include /api/...).
 */
function normalizeApiBase(raw) {
  if (raw == null || String(raw).trim() === "") return "";
  let u = String(raw).trim().replace(/\/+$/, "");
  if (u.endsWith("/api")) {
    u = u.slice(0, -4).replace(/\/+$/, "");
  }
  return u;
}

const fromEnv = normalizeApiBase(import.meta.env.VITE_API_URL);

export const API_BASE =
  fromEnv || (import.meta.env.DEV ? "" : "http://localhost:3002");
