import { useContext } from "react";
import { AdminAuthContext } from "../context/admin-auth-context.js";

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return ctx;
}
