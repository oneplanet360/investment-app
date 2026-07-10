import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '../../components/common/loading-spinner';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
     <LoadingSpinner />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/signin" replace />;
  }

  return <Outlet />;
}