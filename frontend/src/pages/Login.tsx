import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          username: formData.username,
          email: `${formData.username}@arogyamitra.com`
        }));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('ArogyaMitra login error:', error);
      setError('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] flex font-sans font-['Outfit'] selection:bg-cyan-500/30">
      
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#05050a] flex-col justify-between overflow-hidden border-r border-white/5">
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
        
        {/* Abstract Data Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.02] flex items-center justify-center">
            <div className="w-[450px] h-[450px] rounded-full border border-cyan-500/[0.05] animate-spin-slow" style={{ animationDuration: '40s' }}></div>
            <div className="absolute w-[300px] h-[300px] rounded-full border border-indigo-500/[0.08] animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
        </div>

        <div className="p-12 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#111] to-[#050505] border border-white/10 flex items-center justify-center shadow-lg shadow-black/50">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              ArogyaMitra
            </h1>
          </div>
        </div>

        <div className="p-12 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-6 backdrop-blur-md">
            <Zap className="w-3 h-3" /> System 2.0
          </div>
          <h2 className="text-5xl font-medium text-white leading-tight mb-6 tracking-tight">
            Elevate your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">human performance.</span>
          </h2>
          <p className="text-[#a1a1aa] text-lg leading-relaxed font-light">
            Advanced biometric tracking, personalized nutrition, and AI-driven coaching seamlessly integrated into one beautiful interface.
          </p>
        </div>

        <div className="p-12 relative z-10 flex gap-6 text-[#71717a] text-sm">
           <div className="flex items-center gap-2">
             <ShieldCheck className="w-4 h-4" /> SECURE ENCLAVE
           </div>
           <div className="flex items-center gap-2">
             <Activity className="w-4 h-4" /> REAL-TIME SYNC
           </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-3 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              ArogyaMitra
            </h1>
        </div>

        <div className="w-full max-w-sm">
          
          <div className="mb-10 lg:mb-12">
            <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Sign In</h2>
            <p className="text-[#71717a]">Enter your credentials to access your dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <div className="min-w-fit mt-0.5">
                <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-rose-300 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-[#52525b] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
                placeholder="developer"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors">Forgot?</a>
              </div>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-[#52525b] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm tracking-widest font-mono"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white rounded-xl py-3.5 px-4 font-semibold flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
              ) : (
                <>
                  Continue <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#71717a]">
            New to ArogyaMitra?{' '}
            <a href="/register" className="text-white hover:text-cyan-400 transition-colors font-medium">
              Create an account
            </a>
          </div>

          {/* Demo Container */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-[#52525b] mb-4 text-center">Demo Access</p>
            <div className="flex gap-4">
               <div className="flex-1 rounded-lg bg-white/[0.02] border border-white/5 p-3 text-center">
                 <p className="text-[10px] text-[#71717a] uppercase tracking-widest mb-1">User</p>
                 <p className="text-xs text-[#d4d4d8] font-mono">johndoe</p>
               </div>
               <div className="flex-1 rounded-lg bg-white/[0.02] border border-white/5 p-3 text-center">
                 <p className="text-[10px] text-[#71717a] uppercase tracking-widest mb-1">Pass</p>
                 <p className="text-xs text-[#d4d4d8] font-mono">password123</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
