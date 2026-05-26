import { useEffect, useState } from 'react';
import { Users, Store, Star, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services';
import { getApiError } from '../../utils/validators';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboard();
        setStats(res.data.data);
      } catch (err) {
        toast.error(getApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-dark-50">Admin Dashboard</h1>
          <p className="text-sm text-dark-500 mt-0.5">System overview and statistics</p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading statistics..." />
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card">
              <div className="stat-icon bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg shadow-purple-900/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-400">Total Users</p>
                <p className="text-3xl font-bold text-dark-50 tracking-tight">{stats.totalUsers}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-900/30">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-400">Total Stores</p>
                <p className="text-3xl font-bold text-dark-50 tracking-tight">{stats.totalStores}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-900/30">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-400">Total Ratings</p>
                <p className="text-3xl font-bold text-dark-50 tracking-tight">{stats.totalRatings}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};
export default AdminDashboard;
