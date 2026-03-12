import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2, Stethoscope, Eye, EyeOff, CheckCircle2, Activity, Brain, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name || null
      });

      const loginData = new URLSearchParams();
      loginData.append('username', formData.username);
      loginData.append('password', formData.password);
      const loginResponse = await api.post('/token', loginData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { setAuth } = useAuthStore.getState();
      setAuth(loginResponse.data.access_token, loginResponse.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 outline-none transition-all duration-200 hover:border-zinc-700 focus:border-emerald-500/60 focus:bg-zinc-900 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)]";
  const labelClass = "block text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.18em] mb-1.5";

  return (
    <div className="min-h-screen flex bg-[#030305] font-sans overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] p-14 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Stethoscope size={20} className="text-[#030305]" />
            </div>
            <div>
              <p className="text-white font-bold text-lg tracking-tight leading-none">ArogyaMitra</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium mt-0.5">Health Intelligence</p>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-emerald-400/80">Join Today</p>
            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              Start Your<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Health Journey.</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xs">
            Create your free account and get instant access to AI-powered health coaching.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            {[
              { icon: Brain, label: 'AROMI — Your AI health coach' },
              { icon: Activity, label: 'Smart workout & nutrition plans' },
              { icon: TrendingUp, label: 'Real-time progress analytics' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                  <Icon size={12} className="text-emerald-400" />
                </div>
                <span className="text-zinc-400 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-zinc-600 text-xs">© 2026 ArogyaMitra · Free forever, no credit card needed</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#030305] via-zinc-950/50 to-[#030305]" />

        <div className="w-full max-w-md relative z-10 animate-fadeIn my-6">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Stethoscope size={18} className="text-[#030305]" />
            </div>
            <p className="text-white font-bold text-lg">ArogyaMitra</p>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Create Account</h1>
            <p className="text-zinc-500 text-sm">Start your personalized wellness journey today</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-400 text-xs font-bold">!</span>
              </div>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row: Username + Full Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Username <span className="text-emerald-400">*</span></label>
                <div className="relative">
                  <input
                    type="text" name="username" required minLength={3}
                    className={inputClass}
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text" name="full_name"
                  className={inputClass}
                  placeholder="Optional"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email <span className="text-emerald-400">*</span></label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 transition-colors" size={15} />
                <input
                  type="email" name="email" required
                  className={`${inputClass} pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password <span className="text-emerald-400">*</span></label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 transition-colors" size={15} />
                <input
                  type={showPassword ? 'text' : 'password'} name="password" required minLength={6}
                  className={`${inputClass} pl-10 pr-12`}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>Confirm Password <span className="text-emerald-400">*</span></label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-400 transition-colors" size={15} />
                <input
                  type={showConfirm ? 'text' : 'password'} name="confirmPassword" required
                  className={`${inputClass} pl-10 pr-12 ${formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-emerald-500/40' : ''}`}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  )}
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-zinc-600 hover:text-zinc-300 transition-colors">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-sm text-[#030305] bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 mt-1"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18} /><span>Creating Account...</span></>
              ) : (
                <><UserPlus size={18} /><span>Create Free Account</span></>
              )}
            </button>
          </form>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Sign in →
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 mt-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <p className="text-[11px] text-zinc-600 font-medium">256-bit encrypted · Free forever</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
