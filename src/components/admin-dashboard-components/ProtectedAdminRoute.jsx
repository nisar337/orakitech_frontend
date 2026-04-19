import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth.js";

export default function ProtectedAdminRoute() {
  const { isLoggedIn } = useAdminAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
