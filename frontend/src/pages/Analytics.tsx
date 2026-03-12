import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Heart,
  Brain,
  Target,
  Download,
  Eye
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../services/api';

interface AnalyticsData {
  period_days: number;
  total_entries: number;
  heart_rate_trends: any;
  blood_pressure_trends: any;
  weight_trends: any;
  sleep_patterns: any;
  stress_patterns: any;
  metabolic_age: number;
  wellness_score: number;
  recovery_rate: number;
  predictions: any;
  recommendations: string[];
}

function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/biometrics/analytics?days=${selectedPeriod}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const response = await api.post('/analytics/export', { period: selectedPeriod }, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `arogyamitra-analytics-${selectedPeriod}-days.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  // Mock data arrays for charts
  const mockHeartRate = Array.from({ length: 7 }, (_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], value: 65 + Math.random() * 20 }));
  const mockSleep = Array.from({ length: 7 }, (_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], value: 6 + Math.random() * 3 }));
  const mockStress = Array.from({ length: 7 }, (_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], value: 2 + Math.random() * 5 }));
  const mockActivity = Array.from({ length: 7 }, (_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], value: 5000 + Math.random() * 5000 }));


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-800 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
              <Activity className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Analyzing Your Data</h2>
          <p className="text-slate-500 mt-2 font-medium">Generating personalized health insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-2xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
               <BarChart3 className="text-indigo-400 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
                Health Analytics
              </h1>
              <p className="text-slate-400 mt-2 font-medium">Deep insights into your wellness journey</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 backdrop-blur-xl">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none font-semibold transition-all shadow-inner"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
            <button
              onClick={exportReport}
              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold py-2.5 px-5 rounded-xl transition-all flex items-center shadow-[0_0_10px_rgba(99,102,241,0.1)] hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <Download className="w-5 h-5 mr-2 -ml-1" />
              Export Report
            </button>
          </div>
        </div>
      </motion.div>

      {analytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { 
                icon: Brain, 
                color: 'text-indigo-400', 
                bg: 'bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]', 
                label: 'Metabolic Age', 
                value: analytics.metabolic_age, 
                subtext: '-3 years vs actual',
                subtextColor: 'text-emerald-400' 
              },
              { 
                icon: Target, 
                color: 'text-cyan-400', 
                bg: 'bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]', 
                label: 'Wellness Score', 
                value: analytics.wellness_score, 
                subtext: 'Excellent',
                subtextColor: 'text-emerald-400' 
              },
              { 
                icon: Activity, 
                color: 'text-emerald-400', 
                bg: 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]', 
                label: 'Recovery Rate', 
                value: `${analytics.recovery_rate}%`, 
                subtext: 'Fast recovery',
                subtextColor: 'text-emerald-400' 
              },
              { 
                icon: Calendar, 
                color: 'text-amber-400', 
                bg: 'bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]', 
                label: 'Data Points', 
                value: analytics.total_entries, 
                subtext: `${analytics.period_days} days`,
                subtextColor: 'text-slate-400' 
              }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className={`bg-slate-900/80 backdrop-blur-xl rounded-2xl border ${stat.bg} p-6 relative overflow-hidden group`}>
                  <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity bg-current ${stat.color}`}></div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 shadow-inner ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-4xl font-black text-slate-100 tracking-tight">{stat.value}</p>
                    <p className={`text-sm font-medium mt-2 ${stat.subtextColor}`}>{stat.subtext}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Heart Rate Trends */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                   <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                     <Heart className="w-5 h-5 text-rose-500" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-100">Heart Rate Trends</h3>
                </div>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-indigo-400">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 min-h-[250px] w-full bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockHeartRate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#f43f5e', fontWeight: 'bold' }} labelStyle={{ color: '#94a3b8', marginBottom: '4px' }} />
                    <Line type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#1e293b', stroke: '#f43f5e' }} activeDot={{ r: 7, strokeWidth: 0, fill: '#f43f5e', filter: 'drop-shadow(0px 0px 5px rgba(244,63,94,0.8))' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Average</span>
                   <span className="text-lg font-black text-rose-400">72 bpm</span>
                </div>
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Resting</span>
                   <span className="text-lg font-black text-rose-400">58 bpm</span>
                </div>
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Peak</span>
                   <span className="text-lg font-black text-rose-400">145 bpm</span>
                </div>
              </div>
            </motion.div>

            {/* Sleep Patterns */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                     <Brain className="w-5 h-5 text-indigo-400" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-100">Sleep Patterns</h3>
                </div>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-indigo-400">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 min-h-[250px] w-full bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockSleep} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis domain={[0, 12]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#818cf8', fontWeight: 'bold' }} labelStyle={{ color: '#94a3b8', marginBottom: '4px' }} />
                    <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#1e293b', stroke: '#818cf8' }} activeDot={{ r: 7, strokeWidth: 0, fill: '#818cf8', filter: 'drop-shadow(0px 0px 5px rgba(129,140,248,0.8))' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Average</span>
                   <span className="text-lg font-black text-indigo-400">7.5h</span>
                </div>
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Quality</span>
                   <span className="text-lg font-black text-indigo-400">85%</span>
                </div>
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Consist.</span>
                   <span className="text-lg font-black text-emerald-400">Good</span>
                </div>
              </div>
            </motion.div>

            {/* Stress Levels */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                   <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                     <TrendingUp className="w-5 h-5 text-amber-500" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-100">Stress Levels</h3>
                </div>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-indigo-400">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 min-h-[250px] w-full bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockStress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }} labelStyle={{ color: '#94a3b8', marginBottom: '4px' }} />
                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#1e293b', stroke: '#f59e0b' }} activeDot={{ r: 7, strokeWidth: 0, fill: '#f59e0b', filter: 'drop-shadow(0px 0px 5px rgba(245,158,11,0.8))' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Average</span>
                   <span className="text-lg font-black text-amber-400">3.2/10</span>
                </div>
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Peak</span>
                   <span className="text-lg font-black text-amber-400">Morning</span>
                </div>
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Trend</span>
                   <span className="text-lg font-black text-emerald-400">Improv.</span>
                </div>
              </div>
            </motion.div>

            {/* Activity Levels */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 flex flex-col"
            >
               <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                   <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                     <Activity className="w-5 h-5 text-emerald-400" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-100">Activity Levels</h3>
                </div>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-indigo-400">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 min-h-[250px] w-full bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockActivity} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} width={45} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#34d399', fontWeight: 'bold' }} labelStyle={{ color: '#94a3b8', marginBottom: '4px' }} formatter={(value: number) => [Math.round(value).toLocaleString(), 'Steps']} />
                    <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#1e293b', stroke: '#34d399' }} activeDot={{ r: 7, strokeWidth: 0, fill: '#34d399', filter: 'drop-shadow(0px 0px 5px rgba(52,211,153,0.8))' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Daily Avg</span>
                   <span className="text-lg font-black text-emerald-400">8.5k</span>
                </div>
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Active</span>
                   <span className="text-lg font-black text-emerald-400">5.2h</span>
                </div>
                <div className="bg-slate-800/50 rounded-xl py-3 border border-slate-700/50">
                   <span className="block text-xs font-bold uppercase text-slate-500 mb-1">Calories</span>
                   <span className="text-lg font-black text-emerald-400">2.3k</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Predictions & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* AI Predictions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-indigo-500/20 transition-colors"></div>
              
              <div className="flex items-center space-x-3 mb-6 relative z-10">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg border border-indigo-400/30">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 tracking-tight">AI Predictions</h3>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-colors shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                     <TrendingUp className="w-4 h-4 text-emerald-400" />
                     <p className="font-bold text-slate-200">Health Trajectory</p>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pl-6">Based on current trends, your wellness score will reach <span className="text-emerald-400 font-bold">92</span> by next month.</p>
                </div>
                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-colors shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                     <Activity className="w-4 h-4 text-cyan-400" />
                     <p className="font-bold text-slate-200">Risk Assessment</p>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pl-6">Low risk factors detected. Continue your current routine for optimal results.</p>
                </div>
                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-colors shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                     <Target className="w-4 h-4 text-amber-400" />
                     <p className="font-bold text-slate-200">Goal Achievement</p>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pl-6"><span className="text-amber-400 font-bold">85%</span> probability of reaching your fitness goals in 6 weeks.</p>
                </div>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 relative overflow-hidden group"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors"></div>

              <div className="flex items-center space-x-3 mb-6 relative z-10">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl shadow-lg border border-emerald-400/30">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 tracking-tight">Personalized Recommendations</h3>
              </div>

              <div className="space-y-4 relative z-10">
                {analytics.recommendations.slice(0, 4).map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl p-4 border border-slate-700/50 transition-colors shadow-sm">
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0"></div>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
