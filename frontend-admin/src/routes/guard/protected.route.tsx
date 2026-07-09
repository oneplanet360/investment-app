import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth.provder';
import LoadingSpinner from '../../components/common/loading-spinner';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
     <LoadingSpinner />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}