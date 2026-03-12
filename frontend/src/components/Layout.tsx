import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut, Home, Activity, Heart, Bot, Users, BarChart3, User, Menu, X, Brain,
  Stethoscope, Dumbbell, Salad, TrendingUp, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const menuItems = [
  { path: '/dashboard',  label: 'Dashboard',     icon: Home,       color: 'cyan' },
  { path: '/workouts',   label: 'Workouts',       icon: Dumbbell,   color: 'blue' },
  { path: '/nutrition',  label: 'Nutrition',      icon: Salad,      color: 'emerald' },
  { path: '/progress',   label: 'Progress',       icon: TrendingUp, color: 'violet' },
  { path: '/wellness',   label: 'Wellness Plan',  icon: Heart,      color: 'rose' },
  { path: '/ai-coach',   label: 'AROMI Coach',    icon: Brain,      color: 'amber' },
  { path: '/community',  label: 'Community',      icon: Users,      color: 'sky' },
  { path: '/analytics',  label: 'Analytics',      icon: BarChart3,  color: 'purple' },
  { path: '/profile',    label: 'Profile',        icon: User,       color: 'teal' },
];

const colorMap: Record<string, { glow: string; text: string; bg: string; dot: string }> = {
  cyan:    { glow: 'rgba(6,182,212,0.8)',   text: 'text-cyan-400',    bg: 'bg-cyan-400/8',    dot: 'bg-cyan-400' },
  blue:    { glow: 'rgba(59,130,246,0.8)',  text: 'text-blue-400',    bg: 'bg-blue-400/8',    dot: 'bg-blue-400' },
  emerald: { glow: 'rgba(16,185,129,0.8)',  text: 'text-emerald-400', bg: 'bg-emerald-400/8', dot: 'bg-emerald-400' },
  violet:  { glow: 'rgba(139,92,246,0.8)',  text: 'text-violet-400',  bg: 'bg-violet-400/8',  dot: 'bg-violet-400' },
  rose:    { glow: 'rgba(244,63,94,0.8)',   text: 'text-rose-400',    bg: 'bg-rose-400/8',    dot: 'bg-rose-400' },
  amber:   { glow: 'rgba(251,191,36,0.8)',  text: 'text-amber-400',   bg: 'bg-amber-400/8',   dot: 'bg-amber-400' },
  sky:     { glow: 'rgba(14,165,233,0.8)',  text: 'text-sky-400',     bg: 'bg-sky-400/8',     dot: 'bg-sky-400' },
  purple:  { glow: 'rgba(168,85,247,0.8)',  text: 'text-purple-400',  bg: 'bg-purple-400/8',  dot: 'bg-purple-400' },
  teal:    { glow: 'rgba(20,184,166,0.8)',  text: 'text-teal-400',    bg: 'bg-teal-400/8',    dot: 'bg-teal-400' },
};

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#030305] flex flex-col md:flex-row font-sans">

      {/* ── Mobile Header ── */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800/60 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <Stethoscope size={15} className="text-[#030305]" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">ArogyaMitra</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 border border-zinc-800"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Sidebar ── */}
      <nav className={`
        w-full md:w-64 bg-[#09090b]/95 backdrop-blur-2xl border-r border-zinc-800/60
        md:block fixed md:static top-0 left-0 h-full z-40
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-5 overflow-hidden relative">

          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none" />

          {/* Logo — Desktop */}
          <div className="hidden md:flex items-center gap-3 px-3 mb-8 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-[0_0_16px_rgba(6,182,212,0.35)] flex-shrink-0">
              <Stethoscope size={17} className="text-[#030305]" />
            </div>
            <div>
              <p className="text-white font-bold text-[15px] tracking-tight leading-none">ArogyaMitra</p>
              <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-medium mt-1">Health Intelligence</p>
            </div>
          </div>

          {/* Section Label */}
          <p className="hidden md:block text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-semibold px-3 mb-3 relative z-10">Navigation</p>

          {/* Nav Items */}
          <ul className="flex-1 space-y-0.5 relative z-10 overflow-y-auto pr-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const c = colorMap[item.color];

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                      ${active
                        ? `${c.bg} border border-white/5`
                        : 'hover:bg-zinc-800/40 border border-transparent'
                      }
                    `}
                  >
                    {/* Active left bar */}
                    {active && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                        style={{ background: c.dot.replace('bg-', ''), boxShadow: `0 0 8px ${c.glow}` }}
                      />
                    )}

                    {/* Icon */}
                    <div className={`
                      w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${active ? `${c.bg} border border-white/8` : 'bg-zinc-800/50 border border-zinc-700/30 group-hover:bg-zinc-800 group-hover:border-zinc-700/60'}
                    `}>
                      <Icon
                        size={14}
                        className={`transition-colors duration-200 ${active ? c.text : 'text-zinc-500 group-hover:text-zinc-300'}`}
                        strokeWidth={active ? 2.5 : 2}
                      />
                    </div>

                    {/* Label */}
                    <span className={`text-[13px] transition-colors duration-200 ${active ? `${c.text} font-semibold` : 'text-zinc-500 group-hover:text-zinc-300 font-medium'}`}>
                      {item.label}
                    </span>

                    {/* Active dot indicator */}
                    {active && (
                      <div className="ml-auto">
                        <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} style={{ boxShadow: `0 0 6px ${c.glow}` }} />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Bottom Section */}
          <div className="mt-4 pt-4 border-t border-zinc-800/60 relative z-10 space-y-2">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/8 hover:border-rose-500/15 border border-transparent transition-all duration-200 group"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-800/50 border border-zinc-700/30 group-hover:bg-rose-500/15 group-hover:border-rose-500/20 flex items-center justify-center flex-shrink-0 transition-all duration-200">
                <LogOut size={14} className="text-zinc-500 group-hover:text-rose-400 transition-colors" />
              </div>
              <span className="text-[13px] font-medium">Sign Out</span>
            </button>

            {/* Footer */}
            <div className="px-3 pt-1">
              <p className="text-[10px] text-zinc-700 font-medium">© 2026 ArogyaMitra v2.0</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#030305]/80 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#030305]">
        {/* Subtle ambient glow blobs */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-[30%] w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="p-4 md:p-7 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
