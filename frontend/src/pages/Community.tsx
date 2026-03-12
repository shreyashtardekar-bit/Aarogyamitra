import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Target, 
  Calendar, 
  MessageCircle, 
  Heart,
  Share2,
  TrendingUp,
  Award,
  Flame,
  Star
} from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_days: number;
  participants_count: number;
  prize_pool: number;
  start_date: string;
  end_date: string;
  is_user_participating: boolean;
  difficulty_badge: string;
  category_icon: string;
}

interface CommunityPost {
  id: number;
  username: string;
  full_name: string;
  content: string;
  post_type: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  is_liked_by_user: boolean;
}

function Community() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activeTab, setActiveTab] = useState<'challenges' | 'feed' | 'leaderboard'>('challenges');

  useEffect(() => {
    if (activeTab === 'challenges') {
      fetchChallenges();
    } else if (activeTab === 'feed') {
      fetchFeed();
    }
  }, [activeTab]);

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/community/challenges', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/community/feed', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
      case 'intermediate': return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
      case 'advanced': return 'text-orange-400 bg-orange-500/10 border border-orange-500/20';
      case 'expert': return 'text-rose-400 bg-rose-500/10 border border-rose-500/20';
      default: return 'text-slate-400 bg-slate-800 border border-slate-700';
    }
  };

  const joinChallenge = async (challengeId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/community/join/${challengeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchChallenges(); // Refresh challenges
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const likePost = async (postId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/community/like/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchFeed(); // Refresh feed
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-[0_0_16px_rgba(14,165,233,0.3)]">
             <Users size={18} className="text-zinc-900" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-semibold">Social</p>
            <h1 className="text-xl font-black text-white tracking-tight">Wellness Community</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 bg-zinc-900/60 p-1.5 rounded-xl border border-zinc-800 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'challenges', label: 'Challenges', icon: Target },
            { id: 'feed', label: 'Community Feed', icon: MessageCircle },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center flex-shrink-0 gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 hover:border-indigo-500/50 transition-all group/card"
            >
              {/* Challenge Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl p-2 bg-slate-800 rounded-xl border border-slate-700 group-hover/card:border-indigo-500/30 transition-colors shadow-inner">{challenge.category_icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-100 group-hover/card:text-indigo-400 transition-colors">{challenge.title}</h3>
                    <p className="text-sm font-medium text-slate-400 mt-0.5">{challenge.category}</p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider items-center justify-center inline-flex ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty_badge}
                </span>
              </div>

              {/* Challenge Description */}
              <p className="text-slate-300 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                {challenge.description}
              </p>

              {/* Challenge Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-center space-x-1.5 mb-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="text-lg font-black text-slate-100">{challenge.participants_count}</span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Participants</p>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-center space-x-1.5 mb-1.5">
                    <Trophy className="w-4 h-4 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                    <span className="text-lg font-black text-slate-100">{challenge.prize_pool}</span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Prize Pool</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center space-x-2.5 mb-6 px-4 py-2 bg-slate-800/80 rounded-lg border border-slate-700">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-slate-300">{challenge.duration_days} days</span>
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                  ({new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()})
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => joinChallenge(challenge.id)}
                disabled={challenge.is_user_participating}
                className={`w-full py-3 px-4 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 ${
                  challenge.is_user_participating
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                }`}
              >
                {challenge.is_user_participating ? 'Already Joined' : 'Join Challenge'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-6 md:p-8"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-800">
                    <span className="text-white font-bold text-lg">
                      {post.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-100">{post.full_name}</p>
                    <p className="text-sm font-medium text-slate-400">@{post.username}</p>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Post Content */}
              <p className="text-slate-200 mb-6 leading-relaxed font-medium">{post.content}</p>

              {/* Post Actions */}
              <div className="flex items-center space-x-6 pt-5 border-t border-slate-700/50">
                <button
                  onClick={() => likePost(post.id)}
                  className={`flex items-center space-x-2 text-sm font-bold transition-all ${
                    post.is_liked_by_user
                      ? 'text-rose-500'
                      : 'text-slate-400 hover:text-rose-400 cursor-pointer'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.is_liked_by_user ? 'fill-current' : ''}`} />
                  <span>{post.likes_count}</span>
                </button>
                <button className="flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments_count}</span>
                </button>
                <button className="flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-emerald-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-6 md:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="text-center mb-10 relative z-10">
            <div className="inline-block p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 mb-5 shadow-inner">
              <Trophy className="w-16 h-16 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
            </div>
            <h3 className="text-3xl font-black text-slate-100 tracking-tight">Global Leaderboard</h3>
            <p className="text-slate-400 text-lg font-medium mt-2">Top wellness achievers this month</p>
          </div>

          {/* Leaderboard Content */}
          <div className="space-y-4 relative z-10">
            {[
              { rank: 1, name: "Sarah Chen", score: 9850, badge: "🥇", streak: "45 days" },
              { rank: 2, name: "Mike Johnson", score: 9420, badge: "🥈", streak: "38 days" },
              { rank: 3, name: "Emma Davis", score: 9180, badge: "🥉", streak: "32 days" },
              { rank: 4, name: "Alex Rodriguez", score: 8950, badge: "⭐", streak: "28 days" },
              { rank: 5, name: "Lisa Wang", score: 8720, badge: "⭐", streak: "25 days" }
            ].map((entry) => (
              <div key={entry.rank} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-indigo-500/50 transition-all group/lb gap-4 sm:gap-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-slate-700">
                    {entry.badge}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-100 group-hover/lb:text-indigo-400 transition-colors">{entry.name}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Rank #{entry.rank}</p>
                  </div>
                </div>
                <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <div className="flex items-center space-x-1.5 px-3 py-1 bg-orange-500/10 rounded-lg border border-orange-500/20 self-start sm:self-auto mb-0 sm:mb-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">{entry.streak}</span>
                  </div>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{entry.score.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Community;
