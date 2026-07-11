import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../../components/common/loading-spinner";
import useClientAuth from "../../hooks/useClientAuth";

export default function ClientProtectedRoute({
  allowedRole,
}: {
  allowedRole?: "AGENT" | "INVESTOR";
}) {
  const { isAuthenticated, isLoading, user } = useClientAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "AGENT")
      return <Navigate to="/agent/dashboard" replace />;
    return <Navigate to="/investor/dashboard" replace />;
  }

  return <Outlet />;
}
