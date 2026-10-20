import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldAlert } from 'lucide-react';
import { ADMIN_CONFIG, STORAGE_KEYS } from '../config/admin';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password) {
      sessionStorage.setItem(STORAGE_KEYS.adminSession, 'true');
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Incorrect email or password. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-xl font-bold text-purple-900">Admin Login</h1>
            <p className="text-xs text-purple-400 mt-1 text-center">Friend of the Week · Dashboard</p>
          </div>

          {/* Demo warning */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-700">
            <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              This is a <strong>demo-only</strong> login. Credentials are visible in the page source and are not secure.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-purple-800 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-purple-800 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="alert"
                className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md"
            >
              Sign In
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
