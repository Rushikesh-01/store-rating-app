import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  BarChart3,
  LogOut,
  ChevronRight,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const adminNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/stores', icon: Store, label: 'Stores' },
  { to: '/update-password', icon: KeyRound, label: 'Change Password' },
];

const userNav = [
  { to: '/stores', icon: ShoppingBag, label: 'Browse Stores' },
  { to: '/update-password', icon: KeyRound, label: 'Change Password' },
];

const ownerNav = [
  { to: '/owner/dashboard', icon: BarChart3, label: 'My Dashboard' },
  { to: '/update-password', icon: KeyRound, label: 'Change Password' },
];

const navByRole = { ADMIN: adminNav, USER: userNav, STORE_OWNER: ownerNav };

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = navByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="h-full flex flex-col bg-dark-900">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-dark-800">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/40">
          <span className="font-bold text-white text-sm">SR</span>
        </div>
        <span className="font-bold text-lg text-dark-50 tracking-tight">StoreRate</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
        <p className="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-4">Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-900/30 text-primary-300'
                  : 'text-dark-300 hover:bg-dark-800/80 hover:text-dark-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-400' : 'text-dark-400 group-hover:text-dark-200'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-primary-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-dark-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-dark-300 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-5 h-5 text-dark-500 group-hover:text-red-400 transition-colors" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
