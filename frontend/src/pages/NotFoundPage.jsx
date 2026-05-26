import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export const NotFoundPage = () => (
  <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-center p-4">
    <div className="text-8xl font-black text-dark-800 mb-4">404</div>
    <h1 className="text-2xl font-bold text-dark-200 mb-2">Page Not Found</h1>
    <p className="text-dark-500 mb-6">The page you're looking for doesn't exist.</p>
    <a href="/" className="btn-primary">Go Home</a>
  </div>
);

export const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};
