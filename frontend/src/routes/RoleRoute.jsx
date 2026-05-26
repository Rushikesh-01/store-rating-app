import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!roles.includes(user?.role)) return <Navigate to="/" replace />;
  return <ProtectedRoute>{children}</ProtectedRoute>;
};
export default RoleRoute;
