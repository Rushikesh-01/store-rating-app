import { useState } from 'react';
import { KeyRound, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import FormField from '../components/FormField';
import { authService } from '../services';
import { validators, getApiError } from '../utils/validators';

const UpdatePasswordPage = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';
    const pwErr = validators.password(form.newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (form.currentPassword === form.newPassword) errs.newPassword = 'New password must differ from current password';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authService.updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(getApiError(err)); } finally { setLoading(false); }
  };

  const PasswordInput = ({ id, name, value, show, onToggle, placeholder, error }) => (
    <div className="relative">
      <input id={id} name={name} type={show ? 'text' : 'password'} value={value} onChange={handleChange} placeholder={placeholder} className={`input pr-10 ${error ? 'input-error' : ''}`} autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'} />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="mb-6"><h1 className="text-2xl font-bold text-dark-50">Update Password</h1><p className="text-sm text-dark-500 mt-0.5">Change your account password</p></div>
        <div className="card p-4 mb-5 flex items-start gap-3 border-primary-800/50"><Shield className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" /><div><p className="text-sm font-medium text-dark-200">Password Requirements</p><ul className="text-xs text-dark-500 mt-1 space-y-0.5 list-disc list-inside"><li>8 to 16 characters long</li><li>At least one uppercase letter (A–Z)</li><li>At least one special character (!@#$%^&*...)</li></ul></div></div>
        <div className="card p-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormField label="Current Password" id="currentPassword" error={errors.currentPassword}><PasswordInput id="currentPassword" name="currentPassword" value={form.currentPassword} show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} placeholder="Enter current password" error={errors.currentPassword} /></FormField>
            <FormField label="New Password" id="newPassword" error={errors.newPassword}><PasswordInput id="newPassword" name="newPassword" value={form.newPassword} show={showNew} onToggle={() => setShowNew(!showNew)} placeholder="8–16 chars, 1 uppercase, 1 special" error={errors.newPassword} /></FormField>
            <FormField label="Confirm New Password" id="confirmPassword" error={errors.confirmPassword}><div className="relative"><input id="confirmPassword" name="confirmPassword" type={showNew ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} placeholder="Repeat new password" autoComplete="new-password" className={`input ${errors.confirmPassword ? 'input-error' : ''}`} /></div></FormField>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</span>) : (<><KeyRound className="w-4 h-4" /> Update Password</>)}</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default UpdatePasswordPage;
