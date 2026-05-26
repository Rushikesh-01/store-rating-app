import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';
import { validators, validateForm, getApiError } from '../utils/validators';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
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
    const { isValid, errors: errs } = validateForm(form, { email: validators.email, password: (v) => (!v ? 'Password is required' : null) });
    setErrors(errs);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.data.data.token, res.data.data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
      <form onSubmit={handleSubmit} noValidate className="space-y-5 animate-fade-in">
        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
              placeholder="••••••••"
              className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
            />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full h-11 text-base">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <><LogIn className="w-4 h-4" /> Sign In</>
          )}
        </button>
      </form>
      <div className="mt-8 text-center text-sm text-dark-400">
        Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign up now</Link>
      </div>
    </AuthLayout>
  );
};
export default LoginPage;
