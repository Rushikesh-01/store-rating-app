import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, MapPin, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';
import { validators, validateForm, getApiError } from '../utils/validators';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const { isValid, errors: errs } = validateForm(form, {
      name: validators.name, email: validators.email, password: validators.password, address: (v) => v ? validators.address(v) : null,
    });
    setErrors(errs);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.register({ ...form, role: 'USER' });
      login(res.data.data.token, res.data.data.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Join StoreRate today">
      <form onSubmit={handleSubmit} noValidate className="space-y-4 animate-fade-in">
        <div>
          <label className="label">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="At least 20 characters" className={`input pl-9 ${errors.name ? 'input-error' : ''}`} />
          </div>
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={`input pl-9 ${errors.email ? 'input-error' : ''}`} />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="8–16 chars, 1 uppercase, 1 special" className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div>
          <label className="label">Address (Optional)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Your address" className={`input pl-9 ${errors.address ? 'input-error' : ''}`} />
          </div>
          {errors.address && <p className="error-text">{errors.address}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full h-11 text-base mt-2">
          {loading ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</span>
          ) : (
            <><UserPlus className="w-4 h-4" /> Sign Up</>
          )}
        </button>
      </form>
      <div className="mt-8 text-center text-sm text-dark-400">
        Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
      </div>
    </AuthLayout>
  );
};
export default SignupPage;
