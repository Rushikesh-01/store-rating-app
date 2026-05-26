import { useEffect, useState } from 'react';
import { Star, Users, MapPin, Mail, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';
import EmptyState from '../../components/EmptyState';
import { ownerService } from '../../services';
import { getApiError } from '../../utils/validators';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try { const res = await ownerService.getDashboard(); setData(res.data.data); } catch (err) { toast.error(getApiError(err)); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filteredRatings = data?.ratings?.filter((r) => r.user.name.toLowerCase().includes(search.toLowerCase()) || r.user.email.toLowerCase().includes(search.toLowerCase())) || [];
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({ star, count: data?.ratings?.filter((r) => r.rating === star).length || 0, pct: data?.totalRatings ? Math.round((data.ratings.filter((r) => r.rating === star).length / data.totalRatings) * 100) : 0 }));

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div><h1 className="text-2xl font-bold text-dark-50">Store Dashboard</h1><p className="text-sm text-dark-500 mt-0.5">Your store performance overview</p></div>
        {loading ? <LoadingSpinner text="Loading dashboard..." /> : !data ? <EmptyState title="No store found" description="You don't have a store assigned to your account yet. Contact an administrator." /> : (
          <>
            <div className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center flex-shrink-0"><Store className="w-6 h-6 text-white" /></div>
                <div className="flex-1 min-w-0"><h2 className="text-lg font-bold text-dark-50">{data.store.name}</h2><div className="flex flex-wrap gap-3 mt-1"><span className="flex items-center gap-1 text-xs text-dark-500"><Mail className="w-3 h-3" /> {data.store.email}</span><span className="flex items-center gap-1 text-xs text-dark-500"><MapPin className="w-3 h-3" /> {data.store.address}</span></div></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card p-5 flex items-center gap-4">
                <div className="stat-icon bg-gradient-to-br from-amber-500 to-orange-600"><Star className="w-6 h-6 text-white fill-white" /></div>
                <div><p className="text-sm text-dark-500 mb-0.5">Average Rating</p><div className="flex items-baseline gap-2"><span className="text-3xl font-bold text-dark-50">{data.averageRating > 0 ? data.averageRating.toFixed(1) : '—'}</span><span className="text-dark-500 text-sm">/ 5.0</span></div><StarRating rating={data.averageRating} readonly size="sm" /></div>
              </div>
              <div className="card p-5 flex items-center gap-4">
                <div className="stat-icon bg-gradient-to-br from-blue-600 to-indigo-700"><Users className="w-6 h-6 text-white" /></div>
                <div><p className="text-sm text-dark-500 mb-0.5">Total Raters</p><p className="text-3xl font-bold text-dark-50">{data.totalRatings}</p></div>
              </div>
              <div className="card p-5">
                <p className="text-sm text-dark-500 mb-3 font-medium">Rating Distribution</p>
                <div className="space-y-1.5">{ratingDistribution.map(({ star, count, pct }) => (<div key={star} className="flex items-center gap-2"><span className="text-xs text-amber-400 w-8 flex-shrink-0 text-right">{star}★</span><div className="flex-1 h-1.5 rounded-full bg-dark-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} /></div><span className="text-xs text-dark-500 w-6 flex-shrink-0">{count}</span></div>))}</div>
              </div>
            </div>
            <div className="card">
              <div className="card-header flex items-center justify-between"><h3 className="font-semibold text-dark-100 flex items-center gap-2"><Users className="w-4 h-4 text-dark-400" /> Users Who Rated Your Store</h3><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by name or email..." className="input w-56 text-xs" /></div>
              <div className="divide-y divide-dark-800">
                {filteredRatings.length === 0 ? (<div className="py-10 text-center text-dark-500 text-sm">{data.totalRatings === 0 ? 'No ratings yet. Share your store to get your first rating!' : 'No matching users found.'}</div>) : (
                  filteredRatings.map((r) => (<div key={r.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-dark-800/30 transition-colors"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-700 to-blue-800 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">{r.user.name?.charAt(0)?.toUpperCase()}</div><div><p className="text-sm font-medium text-dark-200">{r.user.name}</p><p className="text-xs text-dark-500">{r.user.email}</p></div></div><div className="flex items-center gap-3"><StarRating rating={r.rating} readonly size="sm" /><span className="text-xs text-dark-500">{new Date(r.createdAt).toLocaleDateString()}</span></div></div>))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
export default OwnerDashboard;
