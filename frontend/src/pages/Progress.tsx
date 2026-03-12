import { useState, useEffect } from 'react';
import { LineChart, Activity, TrendingUp, Target, Award, Trophy, Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';

// Progress tracking component
interface ProgressEntry {
  id: number;
  date: string;
  weight: number;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  points: number;
  charity_contribution: number;
  unlocked_at: string;
}

interface Stats {
  total_entries: number;
  first_weight?: number;
  current_weight?: number;
  target_weight?: number;
  weight_change: number;
  progress_percentage: number;
  total_points: number;
  total_charity: number;
  achievement_count: number;
}

function Progress() {
  const [weight, setWeight] = useState('');
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [entriesRes, achievementsRes, statsRes] = await Promise.all([
        api.get('/progress/entries', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/progress/achievements', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/progress/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setEntries(entriesRes.data);
      setAchievements(achievementsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch progress data', error);
    }
  };

  const addEntry = async () => {
    if (!weight || isNaN(parseFloat(weight))) {
      alert('Please enter a valid weight');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/progress/entry',
        { weight: parseFloat(weight) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWeight('');
      fetchData();
    } catch (error) {
      alert('Failed to save progress entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-950 min-h-screen pb-20">
      {/* Header */}
      <div className="mb-8 bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[50px] group-hover:bg-cyan-500/10 transition-colors duration-700"></div>
        <div className="flex items-center relative z-10">
          <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl mr-5 md:mr-6 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <TrendingUp className="text-cyan-400" size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
              Vitals Tracking
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 font-medium">Track your health journey and milestones</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && stats.total_entries > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-8">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Current Weight</div>
              <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                <Target className="text-cyan-400" size={20} />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-100 tracking-tight">{stats.current_weight?.toFixed(1)} <span className="text-lg text-slate-500 font-bold">kg</span></div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Weight Change</div>
              <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <TrendingUp className="text-blue-400" size={20} />
              </div>
            </div>
            <div className={`text-4xl font-black tracking-tight ${stats.weight_change > 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]'}`}>
              {stats.weight_change > 0 ? '-' : '+'}{Math.abs(stats.weight_change).toFixed(1)} <span className="text-lg opacity-70 font-bold">kg</span>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Progress</div>
              <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                <Activity className="text-emerald-400" size={20} />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-100 tracking-tight">{stats.progress_percentage}<span className="text-lg text-emerald-400 font-bold">%</span></div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Charity Impact</div>
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <Award className="text-amber-400" size={20} />
              </div>
            </div>
            <div className="text-4xl font-black text-amber-400 tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]"><span className="text-2xl opacity-80">₹</span>{stats.total_charity.toFixed(2)}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        {/* Input Section */}
        <div className="lg:col-span-1 bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl group">
          <h2 className="text-2xl font-bold mb-6 flex items-center pb-4 border-b border-slate-800 text-slate-100">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl mr-4 border border-cyan-500/20">
              <Target className="text-cyan-400" size={24} />
            </div>
            Update Vitals
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Current Weight (kg)</label>
              <input
                type="number"
                className="w-full px-5 py-3.5 border border-slate-700 bg-slate-800/80 text-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all hover:border-slate-600 shadow-sm placeholder-slate-500 font-medium font-sans"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 75.5"
                step="0.1"
              />
            </div>
            <button
              onClick={addEntry}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-50 rounded-xl hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] font-bold text-lg transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-3" size={22} />
                  Saving...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-3" size={22} />
                  Save Entry
                </>
              )}
            </button>
          </div>

          {stats && stats.target_weight && (
            <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-inner">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Target Weight</div>
              <div className="text-3xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)] mb-3">{stats.target_weight} <span className="text-xl font-bold opacity-80">kg</span></div>
              {stats.current_weight && (
                <div className="text-sm font-semibold text-slate-300 flex items-center bg-slate-900/50 py-2 px-3 rounded-lg border border-slate-700 inline-flex">
                  <Target className="mr-2 text-cyan-400" size={16} />
                  {Math.abs(stats.current_weight - stats.target_weight).toFixed(1)} kg to go
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress History */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl group">
          <h2 className="text-2xl font-bold mb-6 flex items-center pb-4 border-b border-slate-800 text-slate-100">
            <div className="p-2.5 bg-blue-500/10 rounded-xl mr-4 border border-blue-500/20">
              <Activity className="text-blue-400" size={24} />
            </div>
            Vitals History
          </h2>
          {entries.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <LineChart className="mx-auto mb-5 text-slate-600" size={72} />
              <p className="text-xl font-bold text-slate-300 mb-2">No progress entries yet</p>
              <p className="text-base text-slate-500 font-medium">Add your first vitals entry to start tracking!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-5 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all border border-slate-700/50 hover:border-slate-600 group/item"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-xl shadow-inner border border-slate-700 group-hover/item:border-cyan-500/30 transition-colors">
                      <TrendingUp className="text-cyan-400" size={20} />
                    </div>
                    <div>
                      <div className="font-black text-xl text-slate-100 group-hover/item:text-cyan-400 transition-colors">{entry.weight} <span className="text-sm font-bold text-slate-500">kg</span></div>
                      <div className="text-sm font-medium text-slate-400 mt-0.5">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-600 group-hover/item:text-amber-400 transform group-hover/item:scale-110 transition-all duration-300">
                    <Award size={24} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-indigo-500/30 relative overflow-hidden group">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-700/50">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-4 bg-amber-500/10 rounded-2xl mr-5 border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                <Trophy size={40} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Health Milestones</h2>
                <p className="text-slate-400 mt-2 font-medium text-lg">Your health journey rewards</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mr-2">Unlocked</span>
                <span className="text-xl font-black text-cyan-400">{achievements.length}</span>
              </div>
              <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mr-2">Points</span>
                <span className="text-xl font-black text-amber-400">{stats?.total_points || 0}</span>
              </div>
            </div>
          </div>

          {achievements.length === 0 ? (
            <div className="bg-slate-900/50 rounded-2xl p-10 text-center border border-slate-700/50">
              <Award className="mx-auto mb-5 text-slate-600" size={72} />
              <p className="text-2xl font-bold mb-3 text-slate-200">Keep maintaining vitals! The first milestone awaits</p>
              <p className="text-lg font-medium text-slate-400 max-w-2xl mx-auto">Track your progress regularly to unlock milestones and contribute to charity. Every step counts toward your goal!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.id}
                  className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/80 hover:border-amber-500/50 hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all group/card transform hover:-translate-y-1"
                >
                  <div className="flex items-start">
                    <div className="p-3 bg-amber-500/10 rounded-xl mr-4 border border-amber-500/20 group-hover/card:bg-amber-500/20 transition-colors shadow-inner">
                      <Award size={28} className="text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xl mb-1.5 text-slate-100 group-hover/card:text-amber-400 transition-colors">{achievement.title}</div>
                      <div className="text-sm font-medium text-slate-400 mb-4 leading-relaxed">{achievement.description}</div>
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="px-3 py-1.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">{achievement.points} pts</span>
                        <span className="px-3 py-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">₹{achievement.charity_contribution} impact</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Progress;
