import { Navigate, Outlet } from "react-router-dom";
import { isAdminAuthenticated } from "../../services/api";

/**
 * Wraps admin routes — if no valid token in localStorage,
 * redirect to /admin/login. Otherwise render child routes.
 */
export default function ProtectedRoute() {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
