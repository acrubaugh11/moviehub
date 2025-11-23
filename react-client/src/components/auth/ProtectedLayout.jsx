import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth(); 
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }


  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return <Outlet />;
}
