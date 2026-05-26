import { useEffect, useState, useCallback } from 'react';
import { Plus, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import DataTable from '../../components/DataTable';
import SearchInput from '../../components/SearchInput';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import StarRating from '../../components/StarRating';
import { adminService } from '../../services';
import { getApiError } from '../../utils/validators';

const AdminStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [owners, setOwners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getStores({ search, sortBy, sortOrder, page, limit });
      setStores(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page]);

  const fetchOwners = useCallback(async () => {
    try { const res = await adminService.getUsers({ role: 'STORE_OWNER', limit: 100 }); setOwners(res.data.data); } catch {}
  }, []);

  useEffect(() => { const timer = setTimeout(fetchStores, 300); return () => clearTimeout(timer); }, [fetchStores]);
  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => { fetchOwners(); }, [fetchOwners]);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const validateStoreForm = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 20) errs.name = 'Store name must be at least 20 characters';
    if (form.name.trim().length > 60) errs.name = 'Store name must not exceed 60 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.address || !form.address.trim()) errs.address = 'Address is required';
    if (form.address.length > 400) errs.address = 'Address must not exceed 400 characters';
    if (!form.ownerId) errs.ownerId = 'Please select a store owner';
    setFormErrors(errs); return Object.keys(errs).length === 0;
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!validateStoreForm()) return;
    setSubmitting(true);
    try {
      await adminService.createStore({ ...form, ownerId: parseInt(form.ownerId) });
      toast.success('Store created successfully!');
      setModalOpen(false); setForm({ name: '', email: '', address: '', ownerId: '' }); fetchStores();
    } catch (err) { toast.error(getApiError(err)); } finally { setSubmitting(false); }
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (formErrors[e.target.name]) setFormErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const columns = [
    { key: 'name', label: 'Store', sortable: true, render: (row) => (<div><p className="font-medium text-dark-100">{row.name}</p><p className="text-xs text-dark-500">{row.email}</p></div>) },
    { key: 'address', label: 'Address', render: (row) => (<span className="text-dark-400 text-xs line-clamp-2 max-w-[200px]">{row.address}</span>) },
    { key: 'owner', label: 'Owner', render: (row) => (<div><p className="text-sm text-dark-300">{row.owner?.name}</p><p className="text-xs text-dark-500">{row.owner?.email}</p></div>) },
    { key: 'averageRating', label: 'Avg Rating', render: (row) => (<div className="flex items-center gap-2"><StarRating rating={row.averageRating} readonly size="sm" /><span className="text-sm text-dark-300 font-medium">{row.averageRating > 0 ? row.averageRating.toFixed(1) : 'No ratings'}</span></div>) },
    { key: '_count', label: 'Ratings', render: (row) => (<span className="text-dark-400 text-sm flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />{row._count?.ratings ?? 0}</span>) },
    { key: 'createdAt', label: 'Created', sortable: true, render: (row) => (<span className="text-dark-500 text-xs">{new Date(row.createdAt).toLocaleDateString()}</span>) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-dark-50">Stores</h1><p className="text-sm text-dark-500 mt-0.5">{total} total store{total !== 1 ? 's' : ''}</p></div>
          <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add Store</button>
        </div>
        <div className="card p-4"><SearchInput value={search} onChange={setSearch} placeholder="Search stores by name, email, address..." /></div>
        <DataTable columns={columns} data={stores} sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} page={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} loading={loading} emptyMessage="No stores found." />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Store">
        <form onSubmit={handleCreateStore} noValidate className="space-y-4">
          <FormField label="Store Name" id="new-store-name" error={formErrors.name}><input name="name" value={form.name} onChange={handleFormChange} placeholder="At least 20 characters" className={`input ${formErrors.name ? 'input-error' : ''}`} /><p className="text-xs text-dark-600 mt-1">{form.name.length}/60 chars</p></FormField>
          <FormField label="Store Email" id="new-store-email" error={formErrors.email}><input type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="store@example.com" className={`input ${formErrors.email ? 'input-error' : ''}`} /></FormField>
          <FormField label="Address" id="new-store-address" error={formErrors.address}><textarea name="address" value={form.address} onChange={handleFormChange} placeholder="Full store address" rows={2} className={`input resize-none ${formErrors.address ? 'input-error' : ''}`} /></FormField>
          <FormField label="Store Owner" id="new-store-owner" error={formErrors.ownerId}>
            <select name="ownerId" value={form.ownerId} onChange={handleFormChange} className={`input ${formErrors.ownerId ? 'input-error' : ''}`}>
              <option value="">Select a store owner...</option>
              {owners.map((o) => (<option key={o.id} value={o.id}>{o.name} ({o.email})</option>))}
            </select>
            {owners.length === 0 && <p className="text-xs text-amber-400 mt-1">No store owners found. Create a user with Store Owner role first.</p>}
          </FormField>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Creating...' : 'Create Store'}</button></div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
export default AdminStoresPage;
