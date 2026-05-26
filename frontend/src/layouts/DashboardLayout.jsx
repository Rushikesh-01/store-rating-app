import { useState } from 'react';
import { Menu, X, Store, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import RoleBadge from '../components/RoleBadge';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-dark-950/80 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-dark-900 border-r border-dark-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-dark-900/50 border-b border-dark-800 backdrop-blur-md sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-800 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 lg:hidden flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-xs">SR</span>
            </div>
            <span className="font-bold text-dark-100 tracking-tight">StoreRate</span>
          </div>

          <div className="hidden lg:flex flex-1" /> {/* Spacer */}

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-right">
              <div>
                <p className="text-sm font-medium text-dark-100 leading-none">{user?.name}</p>
                <p className="text-xs text-dark-500 mt-1">{user?.email}</p>
              </div>
              <RoleBadge role={user?.role} />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-800 to-dark-700 flex items-center justify-center border border-dark-700">
              <User className="w-5 h-5 text-dark-300" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
