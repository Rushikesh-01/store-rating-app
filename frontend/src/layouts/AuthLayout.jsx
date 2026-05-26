import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = ({ children, title, subtitle }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/stores" replace />;
  }
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-primary-900/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-blue-700 rounded-xl shadow-lg shadow-primary-900/50 flex items-center justify-center">
            <span className="text-xl font-bold text-white tracking-tighter">SR</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-dark-50 tracking-tight">{title}</h2>
        <p className="mt-2 text-center text-sm text-dark-400">{subtitle}</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="card px-4 py-8 sm:px-10 glass">{children}</div>
      </div>
    </div>
  );
};
export default AuthLayout;
