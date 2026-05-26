import { useEffect, useState, useCallback } from 'react';
import { MapPin, Star, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import SearchInput from '../../components/SearchInput';
import StarRating from '../../components/StarRating';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { storeService, ratingService } from '../../services';
import { getApiError } from '../../utils/validators';

const StoreCard = ({ store, onRate }) => (
  <div className="card p-5 hover:border-dark-700 transition-all duration-200 hover:shadow-2xl animate-slide-up">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-blue-800 flex items-center justify-center flex-shrink-0"><Store className="w-5 h-5 text-primary-300" /></div>
      <div className="flex-1 min-w-0"><h3 className="font-semibold text-dark-100 text-base leading-tight truncate">{store.name}</h3><div className="flex items-center gap-1 mt-0.5 text-dark-500 text-xs"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{store.address}</span></div></div>
    </div>
    <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-dark-800/50">
      <div><p className="text-xs text-dark-500 mb-1">Overall Rating</p><div className="flex items-center gap-2"><StarRating rating={store.averageRating} readonly size="sm" /><span className="text-sm font-semibold text-dark-200">{store.averageRating > 0 ? store.averageRating.toFixed(1) : 'No ratings'}</span></div><p className="text-xs text-dark-600 mt-0.5">{store.totalRatings} rating{store.totalRatings !== 1 ? 's' : ''}</p></div>
      <div className="text-right"><p className="text-xs text-dark-500 mb-1">Your Rating</p>{store.userRating ? (<div className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="text-sm font-semibold text-amber-400">{store.userRating.rating}</span><span className="text-xs text-dark-500">/ 5</span></div>) : (<span className="text-xs text-dark-600">Not rated</span>)}</div>
    </div>
    <button onClick={() => onRate(store)} className={`w-full ${store.userRating ? 'btn-secondary' : 'btn-primary'} btn-sm`}><Star className="w-3.5 h-3.5" /> {store.userRating ? 'Update Rating' : 'Rate Store'}</button>
  </div>
);

const StoreListingPage = () => {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const limit = 12;

  const [ratingModal, setRatingModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await storeService.getStores({ search, sortBy, sortOrder, page, limit });
      setStores(res.data.data); setTotal(res.data.pagination.total);
    } catch (err) { toast.error(getApiError(err)); } finally { setLoading(false); }
  }, [search, sortBy, sortOrder, page]);

  useEffect(() => { const timer = setTimeout(fetchStores, 350); return () => clearTimeout(timer); }, [fetchStores]);
  useEffect(() => { setPage(1); }, [search]);

  const openRatingModal = (store) => { setSelectedStore(store); setSelectedRating(store.userRating?.rating || 0); setRatingModal(true); };

  const handleSubmitRating = async () => {
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) { toast.error('Please select a rating between 1 and 5'); return; }
    setSubmittingRating(true);
    try {
      if (selectedStore.userRating) { await ratingService.updateRating(selectedStore.userRating.id, { rating: selectedRating }); toast.success('Rating updated!'); }
      else { await ratingService.createRating({ storeId: selectedStore.id, rating: selectedRating }); toast.success('Rating submitted!'); }
      setRatingModal(false); fetchStores();
    } catch (err) { toast.error(getApiError(err)); } finally { setSubmittingRating(false); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        <div><h1 className="text-2xl font-bold text-dark-50">Browse Stores</h1><p className="text-sm text-dark-500 mt-0.5">{total} store{total !== 1 ? 's' : ''} available — search, browse, and rate</p></div>
        <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 w-full"><SearchInput value={search} onChange={setSearch} placeholder="Search by store name or address..." /></div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <label className="text-xs text-dark-500 whitespace-nowrap">Sort by</label>
            <select value={`${sortBy}:${sortOrder}`} onChange={(e) => { const [field, order] = e.target.value.split(':'); setSortBy(field); setSortOrder(order); }} className="input w-48"><option value="name:asc">Name A → Z</option><option value="name:desc">Name Z → A</option><option value="createdAt:desc">Newest First</option><option value="createdAt:asc">Oldest First</option><option value="address:asc">Address A → Z</option></select>
          </div>
        </div>
        {loading ? <LoadingSpinner text="Loading stores..." /> : stores.length === 0 ? <EmptyState title="No stores found" description={search ? `No results for "${search}". Try a different search term.` : 'No stores have been added yet.'} /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{stores.map((store) => (<StoreCard key={store.id} store={store} onRate={openRatingModal} />))}</div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2"><button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary btn-sm">← Previous</button><span className="text-sm text-dark-500 px-3">Page {page} of {totalPages}</span><button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary btn-sm">Next →</button></div>
        )}
      </div>
      <Modal isOpen={ratingModal} onClose={() => setRatingModal(false)} title={selectedStore?.userRating ? 'Update Your Rating' : 'Rate This Store'} size="sm">
        {selectedStore && (
          <div className="space-y-5 text-center">
            <div><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-700 to-blue-800 flex items-center justify-center mx-auto mb-3"><Store className="w-7 h-7 text-primary-300" /></div><h3 className="font-semibold text-dark-100">{selectedStore.name}</h3><p className="text-xs text-dark-500 mt-0.5 flex items-center justify-center gap-1"><MapPin className="w-3 h-3" /> {selectedStore.address}</p></div>
            <div><p className="text-sm text-dark-400 mb-3">Tap a star to set your rating</p><div className="flex justify-center"><StarRating rating={selectedRating} onRate={setSelectedRating} size="lg" /></div><p className="text-sm text-dark-400 mt-2">{selectedRating > 0 ? (<span className="text-amber-400 font-semibold">{selectedRating} / 5 stars</span>) : ('No rating selected')}</p></div>
            <div className="flex gap-3"><button onClick={() => setRatingModal(false)} className="btn-secondary flex-1">Cancel</button><button onClick={handleSubmitRating} disabled={submittingRating || !selectedRating} className="btn-primary flex-1">{submittingRating ? 'Saving...' : selectedStore.userRating ? 'Update' : 'Submit'}</button></div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
export default StoreListingPage;
