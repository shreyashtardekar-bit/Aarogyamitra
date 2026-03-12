import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Lock, Loader2, Stethoscope, Shield, Eye, EyeOff, Zap, Heart } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/token',
        `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      setAuth(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.detail || 'Invalid username or password');
      } else if (err.request) {
        setError('Cannot connect to server. Is the backend running?');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#030305] font-sans overflow-hidden">
      {/* Left Panel – Branding / Hero */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-14 relative overflow-hidden">
        {/* Aurora blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Stethoscope size={20} className="text-[#030305]" />
            </div>
            <div>
              <p className="text-white font-bold text-lg tracking-tight leading-none">ArogyaMitra</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium mt-0.5">Health Intelligence</p>
            </div>
          </div>
        </div>

        {/* Center Tagline */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-cyan-400/80">Welcome Back</p>
            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              Your Health,<br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Reimagined.</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xs">
            AI-powered wellness coaching that adapts to your unique biology and lifestyle goals.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-col gap-3 pt-2">
            {[
              { icon: Zap, label: 'AI-powered workout & meal plans' },
              { icon: Shield, label: 'Secure & private health data' },
              { icon: Heart, label: 'Personalized wellness insights' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                  <Icon size={12} className="text-cyan-400" />
                </div>
                <span className="text-zinc-400 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-zinc-600 text-xs">© 2026 ArogyaMitra · All rights reserved</p>
        </div>
      </div>

      {/* Right Panel – Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#030305] via-zinc-950/50 to-[#030305]" />

        <div className="w-full max-w-md relative z-10 animate-fadeIn">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
              <Stethoscope size={18} className="text-[#030305]" />
            </div>
            <p className="text-white font-bold text-lg">ArogyaMitra</p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Sign In</h1>
            <p className="text-zinc-500 text-sm">Access your personalized health dashboard</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-400 text-xs font-bold">!</span>
              </div>
              <p className="text-red-400 text-sm leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">Username</label>
              <div className="relative group">
                <input
                  type="text"
                  className="w-full px-4 py-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 outline-none transition-all duration-200 hover:border-zinc-700 focus:border-cyan-500/60 focus:bg-zinc-900 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.08)]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  required
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center opacity-50">
                  <span className="text-[9px] text-zinc-400 font-bold">ID</span>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[11px] text-cyan-500 hover:text-cyan-400 transition-colors font-medium">Forgot password?</button>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3.5 pr-12 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 outline-none transition-all duration-200 hover:border-zinc-700 focus:border-cyan-500/60 focus:bg-zinc-900 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.08)]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden flex justify-center items-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-sm text-[#030305] bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="px-3 bg-[#030305] text-zinc-600 font-medium uppercase tracking-widest">Or continue with</span>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold mb-2.5">Demo Account</p>
            <div className="flex items-center gap-2">
              <code className="text-xs text-cyan-400 font-mono bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-zinc-700/50">admin</code>
              <span className="text-zinc-700">/</span>
              <code className="text-xs text-cyan-400 font-mono bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-zinc-700/50">admin123</code>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-zinc-500 text-sm mt-7">
            New to ArogyaMitra?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Create an account →
            </Link>
          </p>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <p className="text-[11px] text-zinc-600 font-medium">256-bit encrypted · HIPAA compliant</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
