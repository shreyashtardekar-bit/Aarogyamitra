import { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, Apple, History, Trash2, Youtube } from 'lucide-react';

interface MealPlan {
  id: number;
  title: string;
  plan_content: string;
  created_at: string;
  is_active: boolean;
  recipes?: {
    title: string;
    id: number;
    image: string;
    sourceUrl: string;
    calories: string;
    protein: string;
    readyInMinutes: string;
    servings: number;
    youtube_video?: {
      title: string;
      video_id: string;
      thumbnail: string;
      channel_title: string;
      url: string;
    };
  }[];
}

function MealPlan() {
  const [prompt, setPrompt] = useState('Create a 7-day healthy meal plan for a vegetarian looking to lose 5kg.');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<MealPlan[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/meals/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);

      // Load active plan if exists
      const activePlan = response.data.find((p: MealPlan) => p.is_active);
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
      const response = await api.post('/meals/generate',
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlan(response.data.plan_content);
      fetchHistory(); // Refresh history
    } catch (error) {
      console.error(error);
      alert('Error generating meal plan');
    } finally {
      setLoading(false);
    }
  };

  const loadPlan = (mealPlan: MealPlan) => {
    setPlan(mealPlan.plan_content);
    setShowHistory(false);
  };

  const deletePlan = async (id: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/meals/${id}`, {
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
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-slate-950 min-h-screen pb-20">
      {/* Header */}
      <div className="mb-8 bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[50px] group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative z-10 gap-4">
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl mr-5 md:mr-6 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Apple className="text-emerald-400" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
                Nutrition Guide
              </h1>
              <p className="text-slate-400 text-sm md:text-base mt-2 font-medium">AI-powered personalized meal plans</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center px-6 py-3 bg-slate-800/80 text-slate-200 rounded-xl hover:bg-slate-700 transition-all shadow-md border border-slate-700 font-semibold"
          >
            <History className="mr-2 text-emerald-400" size={18} />
            {showHistory ? 'Hide' : 'Show'} History
            <span className="ml-3 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/30">{history.length}</span>
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="mb-8 bg-slate-900/50 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-inner border border-slate-800 hover:border-slate-700 transition-all animate-fadeIn">
          <h3 className="text-2xl font-bold mb-6 flex items-center text-slate-100 pb-4 border-b border-slate-800">
            <div className="p-2.5 bg-slate-800/80 rounded-xl mr-4 border border-slate-700">
              <History className="text-emerald-400" size={24} />
            </div>
            Previous Meal Plans
          </h3>
          {history.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <Apple className="mx-auto text-slate-600 mb-4" size={56} />
              <p className="text-xl font-bold text-slate-300 mb-2">No meal plans yet.</p>
              <p className="text-slate-500 font-medium">Generate your first one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all border border-slate-700/50 hover:border-emerald-500/30 group/item gap-4 sm:gap-0"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => loadPlan(item)}>
                    <p className="font-bold text-lg text-slate-200 flex items-center gap-3 transition-colors group-hover/item:text-emerald-400">
                      <div className="p-2 bg-slate-900 rounded-lg shadow-inner border border-slate-700 group-hover/item:border-emerald-500/30">
                        <Apple className="text-emerald-400" size={18} />
                      </div>
                      {item.title}
                    </p>
                    <p className="text-sm font-medium text-slate-400 mt-2 flex items-center">
                      <span className="bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700">
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {item.is_active && <span className="ml-3 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs rounded-lg font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">Active Version</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => deletePlan(item.id)}
                    className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 self-end sm:self-auto"
                    title="Delete plan"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-8 bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl border border-slate-800 relative z-10 group">
        <h3 className="text-xl md:text-2xl font-bold mb-6 text-slate-100">Describe Your Nutrition Goals</h3>
        <textarea
          className="w-full p-5 border border-slate-700 bg-slate-800/80 text-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none transition-all resize-none shadow-inner placeholder-slate-500 font-medium leading-relaxed font-sans"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Create a 7-day healthy meal plan for a vegetarian looking to lose 5kg, with 1800 calories per day..."
        />
        <button
          onClick={generatePlan}
          disabled={loading}
          className="mt-6 px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-500 text-slate-50 rounded-xl hover:from-emerald-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center sm:justify-start gap-3 font-bold text-lg w-full sm:w-auto transform hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Generating Your Plan...
            </>
          ) : (
            <>
              <Apple size={24} />
              Generate Meal Plan
            </>
          )}
        </button>
      </div>

      {plan && (
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-2xl border border-slate-800 hover:border-emerald-500/30 transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500"></div>
          <div className="flex items-center mb-10 pb-6 border-b border-slate-700/50">
            <div className="p-4 bg-emerald-500/10 rounded-2xl mr-5 border border-emerald-500/20 shadow-inner">
              <Apple className="text-emerald-400" size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
              Your Personalized Meal Plan
            </h2>
          </div>
          <div className="prose prose-lg prose-invert max-w-none prose-emerald">
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-sans text-base md:text-lg">
              {plan}
            </div>
          </div>
          
          {history.find(p => p.plan_content === plan)?.recipes && history.find(p => p.plan_content === plan)!.recipes!.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-700/50">
              <h3 className="text-2xl font-bold text-slate-100 mb-8 flex items-center">
                <div className="p-2.5 bg-amber-500/10 rounded-xl mr-4 border border-amber-500/20">
                  <Apple className="text-amber-400" size={24} />
                </div>
                Recommended Recipes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.find(p => p.plan_content === plan)!.recipes!.map((recipe, idx) => (
                  <div key={idx} className="bg-slate-800/80 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all border border-slate-700 hover:border-emerald-500/50 overflow-hidden h-full flex flex-col transform hover:-translate-y-1">
                    <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="block group relative aspect-video">
                      {recipe.image ? (
                        <img src={recipe.image} alt={recipe.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                         <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                           <Apple className="text-slate-600" size={48} />
                         </div>
                      )}
                      <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 shadow-lg border border-slate-700 z-10">
                        {recipe.readyInMinutes} min
                      </div>
                    </a>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="block group mb-3">
                        <h4 className="font-bold text-slate-200 text-base md:text-lg line-clamp-2 group-hover:text-emerald-400 transition-colors" dangerouslySetInnerHTML={{ __html: recipe.title }}></h4>
                      </a>

                      {recipe.youtube_video && (
                        <a href={recipe.youtube_video.url} target="_blank" rel="noopener noreferrer" className="mb-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 transition-colors group/yt">
                          <Youtube className="text-red-500 group-hover/yt:scale-110 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.3)] rounded-full bg-slate-900 p-1" size={32} />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-slate-200 truncate group-hover/yt:text-red-400 transition-colors">Watch Tutorial</span>
                            <span className="text-xs text-slate-400 font-medium truncate">{recipe.youtube_video.channel_title}</span>
                          </div>
                        </a>
                      )}

                      <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-700/50">
                         <span className="text-sm text-slate-400 font-bold bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
                           <span className="text-amber-400">🔥</span> {recipe.calories}
                         </span>
                         <span className="text-sm text-slate-400 font-bold bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
                           <span className="text-emerald-400">💪</span> {recipe.protein}
                         </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MealPlan;
