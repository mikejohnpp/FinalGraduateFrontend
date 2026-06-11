import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AUTH_PATH_CONSTRAINT } from "@/plugins/routers/authRoutes";

export default function ProtectedRoute() {
  const loginSuccess = useSelector((state: RootState) => state.user.loginSuccess);
  const location = useLocation();

  if (!loginSuccess) {
    return <Navigate to={AUTH_PATH_CONSTRAINT.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
