import { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, History, Trash2, Activity, Dumbbell, Zap, Calendar } from 'lucide-react';

interface WorkoutPlan {
  id: number;
  title: string;
  plan_content: string;
  created_at: string;
  is_active: boolean;
  youtube_videos?: {
    title: string;
    video_id: string;
    thumbnail: string;
    channel_title: string;
    url: string;
  }[];
}

function WorkoutPlan() {
  const [prompt, setPrompt] = useState('Give me a 7-day home workout plan for weight loss, 30 mins a day.');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<WorkoutPlan[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/workout/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);

      // Load active plan if exists
      const activePlan = response.data.find((p: WorkoutPlan) => p.is_active);
      if (activePlan) {
        setPlan(activePlan.plan_content);
      }
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/workout/generate',
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlan(response.data.plan_content);
      fetchHistory(); // Refresh history
    } catch (error) {
      console.error(error);
      alert('Error generating workout plan');
    } finally {
      setLoading(false);
    }
  };

  const loadPlan = (workoutPlan: WorkoutPlan) => {
    setPlan(workoutPlan.plan_content);
    setShowHistory(false);
  };

  const deletePlan = async (id: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/workout/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHistory();
      if (history.find(p => p.id === id)?.is_active) {
        setPlan('');
      }
    } catch (error) {
      alert('Failed to delete plan');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl mr-4 border border-blue-500/30">
              <Dumbbell className="text-cyan-400" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
                Workout Generator
              </h1>
              <p className="text-slate-400 text-sm mt-1">AI-powered personalized fitness plans</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all shadow-md border border-slate-700 hover:border-slate-600 font-medium"
          >
            <History className="mr-2" size={18} />
            {showHistory ? 'Hide' : 'Show'} History
            <span className="ml-2 px-2.5 py-0.5 bg-blue-500/20 text-cyan-400 rounded-full text-xs font-bold border border-blue-500/20">{history.length}</span>
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="mb-8 bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-800">
          <h3 className="text-xl font-bold mb-4 flex items-center text-slate-200">
            <History className="mr-2 text-cyan-400" size={24} />
            Previous Workout Plans
          </h3>
          {history.length === 0 ? (
            <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <Activity className="mx-auto text-slate-600 mb-3" size={48} />
              <p className="text-slate-400 font-medium">No workout plans yet. Generate your first one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all border border-slate-700 hover:border-slate-600 group"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => loadPlan(item)}>
                    <p className="font-semibold text-slate-200 flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
                      <Dumbbell className="text-cyan-500" size={18} />
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-400 mt-1.5 flex items-center gap-3">
                      <span>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {item.is_active && <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full font-semibold border border-cyan-500/20">Active</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => deletePlan(item.id)}
                    className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all border border-transparent hover:border-red-400/20"
                    title="Delete plan"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-8 bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-800">
        <h3 className="text-lg font-bold mb-4 text-slate-200 flex items-center gap-2">
          <Zap className="text-cyan-400" size={20} /> Describe Your Workout Goals
        </h3>
        <textarea
          className="w-full p-4 border border-slate-700 bg-slate-800/50 rounded-xl focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none transition-all resize-none shadow-inner text-slate-100 placeholder-slate-500"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Give me a 7-day home workout plan for weight loss, 30 mins a day, focusing on cardio and strength training..."
        />
        <button
          onClick={generatePlan}
          disabled={loading}
          className="mt-5 w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-50 rounded-xl hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 font-bold transform hover:-translate-y-1"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing & Generating...
            </>
          ) : (
            <>
              <Zap size={20} />
              Generate New Workout Plan
            </>
          )}
        </button>
      </div>

      {plan && (
        <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-800">
          <div className="flex items-center mb-8 pb-6 border-b border-slate-800">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl mr-4 border border-blue-500/30">
              <Dumbbell className="text-cyan-400" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              Your Personalized Workout Plan
            </h2>
          </div>
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-medium">
              {plan}
            </div>
          </div>
          
          {history.find(p => p.plan_content === plan)?.youtube_videos && history.find(p => p.plan_content === plan)!.youtube_videos!.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-slate-200 flex items-center">
                  <Zap className="mr-2 text-cyan-400" size={24} /> Recommended Exercise Videos
                </h3>
                <a 
                  href={`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent("ArogyaMitra Workout")}&details=${encodeURIComponent("Time for your AI-generated workout session! Check ArogyaMitra for the full plan.")}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-500/50 rounded-xl hover:bg-slate-700 transition shadow-md font-medium text-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  <Calendar size={16} /> Sync to Calendar
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.find(p => p.plan_content === plan)!.youtube_videos!.map((video, idx) => (
                  <a key={idx} href={video.url} target="_blank" rel="noopener noreferrer" className="block group">
                    <div className="bg-slate-800/50 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-700 hover:border-blue-500/50 overflow-hidden h-full flex flex-col transform hover:-translate-y-1">
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-700">
                        <img src={video.thumbnail} alt={video.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                             <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h4 className="font-semibold text-slate-200 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-cyan-400 transition-colors" dangerouslySetInnerHTML={{ __html: video.title }}></h4>
                        <p className="text-xs text-slate-400 mt-auto font-medium">{video.channel_title}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkoutPlan;
