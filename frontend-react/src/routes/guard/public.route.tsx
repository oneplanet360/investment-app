import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '../../components/common/loading-spinner';
import useAuth from '../../hooks/useAuth';

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/admin/dashboard" replace />;
}
