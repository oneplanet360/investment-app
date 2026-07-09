import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth.provder';
import LoadingSpinner from '../../components/common/loading-spinner';

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
