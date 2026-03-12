import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Apple, ChevronRight, AlertCircle,
  TrendingUp, Trophy, Target, Zap, Heart, MessageCircle,
  Clock, Star, Flame, Brain, Dumbbell, Salad
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import api from '../services/api';

interface UserData {
  username: string;
  full_name?: string;
  fitness_goal?: string;
  current_weight?: number;
  target_weight?: number;
}

interface Stats {
  workoutPlans: number;
  mealPlans: number;
  progressEntries: number;
  achievements: number;
  totalPoints: number;
  currentStreak: number;
}

interface RecentActivity {
  type: string;
  title: string;
  date: string;
  icon: any;
  color: string;
}

const StatCard = ({ value, label, icon: Icon, color, glow }: any) => (
  <div className={`bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all duration-300 group overflow-hidden relative`}>
    <div className={`absolute -top-8 -right-8 w-24 h-24 ${glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
        <Icon size={16} className="text-zinc-900" />
      </div>
    </div>
    <p className="text-3xl font-black text-white tracking-tight">{value}</p>
    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mt-1">{label}</p>
  </div>
);

function Dashboard() {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats>({
    workoutPlans: 0, mealPlans: 0, progressEntries: 0,
    achievements: 0, totalPoints: 0, currentStreak: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/health')
      .then(() => { setBackendStatus('online'); fetchAllData(); })
      .catch(() => { setBackendStatus('offline'); setLoading(false); });
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const userResponse = await api.get('/users/me', { headers });
      setUser(userResponse.data);

      const [workouts, meals, progress, achievements] = await Promise.all([
        api.get('/workout/history', { headers }).catch(() => ({ data: [] })),
        api.get('/meals/history', { headers }).catch(() => ({ data: [] })),
        api.get('/progress/entries', { headers }).catch(() => ({ data: [] })),
        api.get('/progress/achievements', { headers }).catch(() => ({ data: [] }))
      ]);

      const totalPoints = achievements.data.reduce((sum: number, a: any) => sum + (a.points || 0), 0);
      setStats({
        workoutPlans: workouts.data.length || 0,
        mealPlans: meals.data.length || 0,
        progressEntries: progress.data.length || 0,
        achievements: achievements.data.length || 0,
        totalPoints,
        currentStreak: progress.data.length || 0
      });

      if (progress.data && progress.data.length > 0) {
        const sorted = [...progress.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setProgressData(sorted.slice(-7).map((e: any) => ({
          date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: e.weight
        })));
      }

      const activities: RecentActivity[] = [];
      if (workouts.data.length > 0) activities.push({ type: 'workout', title: 'Generated workout plan', date: new Date(workouts.data[0].created_at).toLocaleDateString(), icon: Dumbbell, color: 'text-blue-400' });
      if (meals.data.length > 0) activities.push({ type: 'meal', title: 'Created meal plan', date: new Date(meals.data[0].created_at).toLocaleDateString(), icon: Salad, color: 'text-emerald-400' });
      if (progress.data.length > 0) activities.push({ type: 'progress', title: `Logged weight: ${progress.data[progress.data.length - 1].weight} kg`, date: new Date(progress.data[progress.data.length - 1].date).toLocaleDateString(), icon: TrendingUp, color: 'text-violet-400' });
      if (achievements.data.length > 0) activities.push({ type: 'achievement', title: `Unlocked: ${achievements.data[achievements.data.length - 1].title}`, date: new Date(achievements.data[achievements.data.length - 1].unlocked_at).toLocaleDateString(), icon: Trophy, color: 'text-amber-400' });
      setRecentActivities(activities.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      setLoading(false);
    }
  };

  const motivationalQuotes = [
    "Every workout is progress.",
    "Your health is an investment, not an expense.",
    "Strong body, strong mind.",
    "Today's effort is tomorrow's strength.",
    "Be better than yesterday."
  ];
  const todayQuote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-zinc-600 uppercase tracking-[0.2em] font-semibold mb-1">Dashboard</p>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">{user?.full_name || user?.username || 'User'}</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">{user?.fitness_goal || 'Your health journey continues today.'}</p>
        </div>

        {/* Backend Status */}
        <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold tracking-widest uppercase ${
          backendStatus === 'online' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' :
          backendStatus === 'offline' ? 'border-red-500/20 bg-red-500/5 text-red-400' :
          'border-zinc-700/50 bg-zinc-800/50 text-zinc-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : backendStatus === 'offline' ? 'bg-red-400' : 'bg-zinc-500'}`} />
          {backendStatus === 'online' ? 'System Online' : backendStatus === 'offline' ? 'Offline' : 'Checking...'}
        </div>
      </div>

      {/* ── Offline Warning ── */}
      {backendStatus === 'offline' && (
        <div className="p-4 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 text-sm font-semibold">Backend Unavailable</p>
            <p className="text-red-400/70 text-xs mt-1">Ensure the backend is running at <code className="bg-red-900/30 px-1.5 py-0.5 rounded font-mono">http://127.0.0.1:8000</code></p>
          </div>
        </div>
      )}


      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value={stats.workoutPlans} label="Workout Plans" icon={Dumbbell} color="bg-gradient-to-br from-blue-400 to-cyan-400" glow="bg-blue-500/20" />
        <StatCard value={stats.mealPlans} label="Meal Plans" icon={Salad} color="bg-gradient-to-br from-emerald-400 to-teal-400" glow="bg-emerald-500/20" />
        <StatCard value={stats.progressEntries} label="Progress Entries" icon={TrendingUp} color="bg-gradient-to-br from-violet-400 to-purple-400" glow="bg-violet-500/20" />
        <StatCard value={stats.achievements} label="Achievements" icon={Trophy} color="bg-gradient-to-br from-amber-400 to-yellow-400" glow="bg-amber-500/20" />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Feature Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Workouts', subtitle: 'AI-powered routines', icon: Dumbbell, path: '/workouts', count: stats.workoutPlans, label: 'Plans', from: 'from-blue-500', to: 'to-cyan-400', btnText: 'Go to Workouts', border: 'hover:border-blue-500/30', glow: 'shadow-blue-500/20' },
            { title: 'Nutrition', subtitle: 'Smart meal planning', icon: Salad, path: '/nutrition', count: stats.mealPlans, label: 'Plans', from: 'from-emerald-500', to: 'to-teal-400', btnText: 'View Nutrition', border: 'hover:border-emerald-500/30', glow: 'shadow-emerald-500/20' },
            { title: 'Progress', subtitle: 'Track your journey', icon: TrendingUp, path: '/progress', count: stats.progressEntries, label: 'Entries', from: 'from-violet-500', to: 'to-purple-400', btnText: 'Log Progress', border: 'hover:border-violet-500/30', glow: 'shadow-violet-500/20' },
            { title: 'AROMI Coach', subtitle: 'Your AI health coach', icon: Brain, path: '/ai-coach', count: null, label: null, from: 'from-amber-500', to: 'to-orange-400', btnText: 'Start Chat', border: 'hover:border-amber-500/30', glow: 'shadow-amber-500/20' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className={`bg-zinc-900/60 border border-zinc-800 ${card.border} rounded-2xl p-5 flex flex-col transition-all duration-300 group`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">{card.title}</h3>
                    <p className="text-xs text-zinc-600 mt-0.5">{card.subtitle}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${card.from} ${card.to} flex items-center justify-center`}>
                    <Icon size={14} className="text-zinc-900" />
                  </div>
                </div>
                {card.count !== null && (
                  <div className="mb-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <p className="text-2xl font-black text-white">{card.count}</p>
                    <p className="text-xs text-zinc-600 font-medium mt-0.5">{card.label} generated</p>
                  </div>
                )}
                {card.count === null && (
                  <div className="mb-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <p className="text-xs text-zinc-400 leading-relaxed">Get personalized health advice 24/7</p>
                  </div>
                )}
                <button
                  onClick={() => navigate(card.path)}
                  className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-zinc-900 bg-gradient-to-r ${card.from} ${card.to} hover:opacity-90 hover:-translate-y-0.5 transition-all`}
                >
                  {card.btnText} <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Activity + Chart */}
        <div className="space-y-4">
          {/* Recent Activity */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
                <Clock size={13} className="text-zinc-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Recent Activity</h3>
            </div>
            {recentActivities.length > 0 ? (
              <div className="space-y-2">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-zinc-800/40 hover:bg-zinc-800/70 rounded-xl border border-zinc-700/30 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                        <Icon size={13} className={activity.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-300 truncate">{activity.title}</p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">{activity.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap size={28} className="text-zinc-700 mx-auto mb-2" />
                <p className="text-xs text-zinc-500 font-medium">No activity yet</p>
                <p className="text-[10px] text-zinc-700 mt-0.5">Start your wellness journey!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
                <Zap size={13} className="text-zinc-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Update Profile', icon: Target, path: '/profile', color: 'text-teal-400' },
                { label: 'Log Progress', icon: Heart, path: '/progress', color: 'text-rose-400' },
                { label: 'Wellness Plan', icon: Star, path: '/wellness', color: 'text-amber-400' },
              ].map(({ label, icon: Icon, path, color }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center gap-3 p-3 bg-zinc-800/40 hover:bg-zinc-800/70 rounded-xl border border-zinc-700/30 hover:border-zinc-600/50 transition-all text-left group"
                >
                  <Icon size={14} className={color} />
                  <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">{label}</span>
                  <ChevronRight size={13} className="ml-auto text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Weight Trend Chart */}
          {progressData.length > 0 && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
                  <TrendingUp size={13} className="text-cyan-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Weight Trend</h3>
              </div>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} dy={6} />
                    <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} width={28} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #27272a', backgroundColor: '#18181b', color: '#f4f4f5', fontSize: 12 }} itemStyle={{ color: '#22d3ee' }} />
                    <Area type="monotone" dataKey="weight" stroke="#06b6d4" strokeWidth={2} fill="url(#wGrad)" dot={{ r: 3, fill: '#06b6d4', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#06b6d4', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Achievements */}
          {stats.achievements > 0 && (
            <div className="bg-zinc-900/60 border border-amber-500/15 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/8 rounded-full blur-2xl" />
              <div className="flex items-center gap-2.5 mb-4 relative z-10">
                <Trophy size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white">Milestones</h3>
              </div>
              <div className="flex items-end gap-3 relative z-10">
                <div>
                  <p className="text-3xl font-black text-white">{stats.achievements}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-0.5">Badges Earned</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-black text-amber-400">{stats.totalPoints}</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">Points</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
