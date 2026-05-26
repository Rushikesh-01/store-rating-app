import { useEffect, useState, useCallback } from 'react';
import { Plus, Eye, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import DataTable from '../../components/DataTable';
import SearchInput from '../../components/SearchInput';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import RoleBadge from '../../components/RoleBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services';
import { validators, validateForm, getApiError } from '../../utils/validators';

const ROLE_OPTIONS = ['', 'ADMIN', 'USER', 'STORE_OWNER'];

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [viewUser, setViewUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ search, role: roleFilter, sortBy, sortOrder, page, limit });
      setUsers(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, sortBy, sortOrder, page]);

  useEffect(() => { const timer = setTimeout(fetchUsers, 300); return () => clearTimeout(timer); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const handleViewUser = async (id) => {
    setLoadingUser(true); setViewModalOpen(true);
    try {
      const res = await adminService.getUserById(id);
      setViewUser(res.data.data.user);
    } catch (err) {
      toast.error(getApiError(err));
      setViewModalOpen(false);
    } finally {
      setLoadingUser(false);
    }
  };

  const validateForm_ = () => {
    const { isValid, errors } = validateForm(form, {
      name: validators.name, email: validators.email, password: validators.password, address: (v) => (v ? validators.address(v) : null),
    });
    setFormErrors(errors); return isValid;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!validateForm_()) return;
    setSubmitting(true);
    try {
      await adminService.createUser(form);
      toast.success('User created successfully!');
      setModalOpen(false); setForm({ name: '', email: '', password: '', address: '', role: 'USER' });
      fetchUsers();
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (formErrors[e.target.name]) setFormErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (row) => (<div><p className="font-medium text-dark-100">{row.name}</p><p className="text-xs text-dark-500">{row.email}</p></div>) },
    { key: 'role', label: 'Role', sortable: true, render: (row) => <RoleBadge role={row.role} /> },
    { key: 'address', label: 'Address', render: (row) => (<span className="text-dark-400 text-xs line-clamp-1 max-w-[200px]">{row.address || '—'}</span>) },
    { key: 'createdAt', label: 'Joined', sortable: true, render: (row) => (<span className="text-dark-500 text-xs">{new Date(row.createdAt).toLocaleDateString()}</span>) },
    { key: 'actions', label: 'Actions', render: (row) => (<button onClick={() => handleViewUser(row.id)} className="btn-secondary btn-sm"><Eye className="w-3.5 h-3.5" /> View</button>) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-50">Users</h1>
            <p className="text-sm text-dark-500 mt-0.5">{total} total user{total !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add User</button>
        </div>
        <div className="card p-4 flex flex-col sm:flex-row gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email, address..." />
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-dark-500" />
            <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="input w-44">
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
        </div>
        <DataTable columns={columns} data={users} sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} page={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} loading={loading} emptyMessage="No users found." />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New User">
        <form onSubmit={handleCreateUser} noValidate className="space-y-4">
          <FormField label="Full Name" id="new-user-name" error={formErrors.name}><input name="name" value={form.name} onChange={handleFormChange} placeholder="At least 20 characters" className={`input ${formErrors.name ? 'input-error' : ''}`} /></FormField>
          <FormField label="Email" id="new-user-email" error={formErrors.email}><input type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="user@example.com" className={`input ${formErrors.email ? 'input-error' : ''}`} /></FormField>
          <FormField label="Password" id="new-user-password" error={formErrors.password}><input type="password" name="password" value={form.password} onChange={handleFormChange} placeholder="8–16 chars, 1 uppercase, 1 special" className={`input ${formErrors.password ? 'input-error' : ''}`} /></FormField>
          <FormField label="Address (optional)" id="new-user-address" error={formErrors.address}><input name="address" value={form.address} onChange={handleFormChange} placeholder="Address" className="input" /></FormField>
          <FormField label="Role" id="new-user-role"><select name="role" value={form.role} onChange={handleFormChange} className="input"><option value="USER">User</option><option value="ADMIN">Admin</option><option value="STORE_OWNER">Store Owner</option></select></FormField>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Creating...' : 'Create User'}</button></div>
        </form>
      </Modal>

      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="User Details" size="lg">
        {loadingUser ? <LoadingSpinner text="Loading user..." /> : viewUser ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/60">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-blue-700 flex items-center justify-center text-white font-bold text-xl">{viewUser.name?.charAt(0)?.toUpperCase()}</div>
              <div><p className="font-semibold text-dark-50 text-lg">{viewUser.name}</p><p className="text-dark-400 text-sm">{viewUser.email}</p><RoleBadge role={viewUser.role} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-dark-800/40"><p className="text-xs text-dark-500 mb-1">Address</p><p className="text-sm text-dark-200">{viewUser.address || '—'}</p></div>
              <div className="p-3 rounded-lg bg-dark-800/40"><p className="text-xs text-dark-500 mb-1">Joined</p><p className="text-sm text-dark-200">{new Date(viewUser.createdAt).toLocaleDateString()}</p></div>
            </div>
            {viewUser.ratings?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-dark-300 mb-3">Ratings ({viewUser.ratings.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                  {viewUser.ratings.map((r) => (<div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg bg-dark-800/40"><span className="text-sm text-dark-300">{r.store?.name}</span><span className="flex items-center gap-1 text-amber-400 font-medium text-sm">★ {r.rating}</span></div>))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </DashboardLayout>
  );
};
export default AdminUsersPage;
