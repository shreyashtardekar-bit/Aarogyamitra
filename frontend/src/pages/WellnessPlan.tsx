import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Target, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Clock,
  Award,
  Heart,
  Brain,
  Zap
} from 'lucide-react';

interface WellnessPlan {
  id: number;
  plan_type: string;
  plan_data: any;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

function WellnessPlan() {
  const [currentPlan, setCurrentPlan] = useState<WellnessPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState({
    goals: '',
    preferences: '',
    timeframe: '90'
  });

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const response = await api.get('/wellness/current');
      setCurrentPlan(response.data);
    } catch (error) {
      console.error('Error fetching wellness plan:', error);
    }
  };

  const generateNewPlan = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        prompt: `Create a ${preferences.timeframe} day wellness plan. Goals: ${preferences.goals}. Preferences: ${preferences.preferences}`,
        goals: [preferences.goals],
        preferences: { timeframe: preferences.timeframe, details: preferences.preferences }
      };
      const response = await api.post('/wellness/generate', payload);
      setCurrentPlan(response.data);
    } catch (error) {
      console.error('Error generating wellness plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              Wellness Plan
            </h1>
            <p className="text-slate-400 mt-2 font-medium">AI-powered personalized wellness transformation</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
              <span className="text-sm font-semibold text-emerald-400">
                {currentPlan ? 'Active Plan' : 'No Active Plan'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {currentPlan ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Plan Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Plan Overview */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-100">Your Wellness Journey</h2>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-400">
                    {new Date(currentPlan.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:bg-slate-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-400">Goals</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-100">12</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:bg-slate-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-400">Activities</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-100">28</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:bg-slate-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="w-5 h-5 text-rose-400" />
                    <span className="text-xs font-semibold text-slate-400">Health Score</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-100">85</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:bg-slate-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-xs font-semibold text-slate-400">Energy</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-100">92%</p>
                </div>
              </div>

              {/* Plan Details */}
              <div className="space-y-6">
                {/* Dynamically parsed logic will come here, but for now assuming text format */}
                <div className="prose prose-invert max-w-none text-slate-300">
                    <pre className="whitespace-pre-wrap font-sans bg-transparent border-0 p-0 text-slate-300">
                        {typeof currentPlan.plan_data === 'string' ? currentPlan.plan_data : JSON.stringify(currentPlan.plan_data, null, 2)}
                    </pre>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6">
              <h3 className="text-xl font-bold text-slate-100 mb-6">Progress Tracking</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-slate-400">Overall Progress</span>
                    <span className="text-emerald-400">68%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-700/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-slate-400">Weekly Goals</span>
                    <span className="text-cyan-400">5/7</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-700/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: '71%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* AI Insights */}
            <div className="relative bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] p-6 text-white overflow-hidden">
              <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-[30px]"></div>
              <div className="flex items-center gap-3 mb-5">
                <Brain className="text-emerald-400" size={24} />
                <h3 className="text-xl font-bold">AROMI Insights</h3>
              </div>
              <div className="space-y-4 text-sm font-medium relative z-10 text-emerald-50">
                <p className="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">Your recovery rate is improving by 15% this week. Keep up the great work!</p>
                <p className="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">Consider increasing protein intake by 10% for optimal muscle recovery.</p>
                <p className="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">Your sleep quality score has increased - maintain your current bedtime routine.</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 mr-3 text-yellow-400" />
                <h3 className="text-lg font-bold text-slate-100">Recent Achievements</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">7-Day Streak</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Completed daily goals</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">💪</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Strength Master</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Completed all workouts</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🧘</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Mindfulness Pro</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">10 meditation sessions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-5">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-slate-800 border border-slate-700 hover:border-emerald-500/30 hover:bg-slate-700 hover:text-emerald-400 text-slate-300 font-medium py-3 px-4 rounded-xl transition-all">
                  Optimize Plan
                </button>
                <button className="w-full bg-slate-800 border border-slate-700 hover:border-cyan-500/30 hover:bg-slate-700 hover:text-cyan-400 text-slate-300 font-medium py-3 px-4 rounded-xl transition-all">
                  View History
                </button>
                <button className="w-full bg-slate-800 border border-slate-700 hover:border-slate-500/30 hover:bg-slate-700 text-slate-300 font-medium py-3 px-4 rounded-xl transition-all">
                  Export Plan
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Generate New Plan */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mt-10"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8">
            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Sparkles className="w-12 h-12 text-slate-950" />
              </div>
              <h2 className="text-3xl font-bold text-slate-100 mb-3 tracking-tight">Design Your Perfect Day</h2>
              <p className="text-slate-400 font-medium">Let AROMI create a personalized wellness journey just for you</p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  What are your wellness goals?
                </label>
                <textarea
                  value={preferences.goals}
                  onChange={(e) => setPreferences({ ...preferences, goals: e.target.value })}
                  className="w-full p-4 border border-slate-700 bg-slate-800/50 rounded-xl focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none transition-all resize-none shadow-inner text-slate-100 placeholder-slate-500"
                  rows={3}
                  placeholder="e.g., Lose weight, build muscle, improve sleep, reduce stress..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Any preferences or restrictions?
                </label>
                <textarea
                  value={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.value })}
                  className="w-full p-4 border border-slate-700 bg-slate-800/50 rounded-xl focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none transition-all resize-none shadow-inner text-slate-100 placeholder-slate-500"
                  rows={3}
                  placeholder="e.g., Dietary restrictions, time constraints, preferred activities..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Plan Duration
                </label>
                <select
                  value={preferences.timeframe}
                  onChange={(e) => setPreferences({ ...preferences, timeframe: e.target.value })}
                  className="w-full px-4 py-3.5 border border-slate-700 bg-slate-800/50 rounded-xl focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none transition-all shadow-inner text-slate-100 font-medium appearance-none"
                >
                  <option value="30">30 Days Focus</option>
                  <option value="60">60 Days Transformation</option>
                  <option value="90">90 Days Lifestyle Change</option>
                </select>
              </div>

              <button
                onClick={generateNewPlan}
                disabled={isGenerating || !preferences.goals}
                className="w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 transform hover:-translate-y-1"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-950 border-t-transparent mr-3"></div>
                    Generating AI Plan...
                  </div>
                ) : (
                  <>
                    <Zap className="mr-2" size={20} /> Generate Wellness Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default WellnessPlan;
