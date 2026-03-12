import { useState, useEffect } from 'react';
import { User, Mail, Save, Loader2, Award, TrendingUp, Info, Sparkles } from 'lucide-react';
import api from '../services/api';

interface UserProfile {
  username: string;
  email: string;
  full_name?: string;
  age?: number;
  gender?: string;
  height?: number;
  current_weight?: number;
  target_weight?: number;
  fitness_level?: string;
  fitness_goal?: string;
  health_conditions?: string[];
  dietary_restrictions?: string[];
}

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!profile) return;

    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value === '' ? undefined : value
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      await api.put('/users/me', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] animate-fadeIn">
        <Loader2 className="animate-spin text-cyan-500 mb-4" size={48} />
        <p className="text-slate-400 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-md mx-auto mt-10 animate-scaleIn backdrop-blur-xl">
        <p className="text-red-400 flex items-center font-bold">
          <Info className="mr-3" size={24} />
          Failed to load profile
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20">
      {/* Header */}
      <div className="mb-8 bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[50px] group-hover:bg-cyan-500/10 transition-colors duration-700"></div>
        <div className="flex items-center relative z-10">
          <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl mr-6 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <User className="text-cyan-400" size={36} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
              My Profile
            </h1>
            <p className="text-slate-400 text-base md:text-lg mt-2 font-medium">Manage your information and health goals</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-800 p-6 md:p-10 mb-8 relative">

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-xl mb-8 flex items-center shadow-lg animate-fadeIn">
            <Award className="mr-3 flex-shrink-0" size={24} />
            <span className="font-bold">{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-8 flex items-center shadow-lg animate-fadeIn">
            <Info className="mr-3 flex-shrink-0" size={24} />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center pb-4 border-b border-slate-800">
              <div className="p-2.5 bg-blue-500/10 rounded-xl mr-4 border border-blue-500/20">
                <Mail className="text-blue-400" size={24} />
              </div>
              Basic Information
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Username</label>
                <input
                  type="text"
                  value={profile.username}
                  disabled
                  className="w-full px-5 py-3.5 border border-slate-700/50 rounded-xl bg-slate-800/50 cursor-not-allowed text-slate-500 font-medium"
                />              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 border border-slate-700 bg-slate-800/80 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all hover:border-slate-600 text-slate-100 shadow-sm placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name || ''}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-5 py-3.5 border border-slate-700 bg-slate-800/80 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all hover:border-slate-600 text-slate-100 shadow-sm placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={profile.age || ''}
                    onChange={handleChange}
                    placeholder="Your age"
                    min="13"
                    max="120"
                    className="w-full px-5 py-3.5 border border-slate-700 bg-slate-800/80 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all hover:border-slate-600 text-slate-100 shadow-sm placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender || ''}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 border border-slate-700 bg-slate-800/80 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all hover:border-slate-600 text-slate-100 shadow-sm appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2322d3ee%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                  >
                    <option value="" className="bg-slate-800 text-slate-300">Select...</option>
                    <option value="male" className="bg-slate-800 text-slate-100">Male</option>
                    <option value="female" className="bg-slate-800 text-slate-100">Female</option>
                    <option value="other" className="bg-slate-800 text-slate-100">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Fitness Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center pb-4 border-b border-slate-800">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl mr-4 border border-emerald-500/20">
                <TrendingUp className="text-emerald-400" size={24} />
              </div>
              Health Metrics
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={profile.height || ''}
                  onChange={handleChange}
                  placeholder="e.g., 170"
                  min="100"
                  max="250"
                  step="0.1"
                  className="w-full px-5 py-3.5 border border-slate-700 bg-slate-800/80 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:border-slate-600 text-slate-100 shadow-sm placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Current Weight (kg)</label>
                  <input
                    type="number"
                    name="current_weight"
                    value={profile.current_weight || ''}
                    onChange={handleChange}
                    placeholder="e.g., 75"
                    min="30"
                    max="300"
                    step="0.1"
                    className="w-full px-5 py-3.5 border border-slate-700 bg-slate-800/80 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:border-slate-600 text-slate-100 shadow-sm placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Target Weight (kg)</label>
                  <input
                    type="number"
                    name="target_weight"
                    value={profile.target_weight || ''}
                    onChange={handleChange}
                    placeholder="e.g., 70"
                    min="30"
                    max="300"
                    step="0.1"
                    className="w-full px-5 py-3.5 border border-slate-700 bg-slate-800/80 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:border-slate-600 text-slate-100 shadow-sm placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Health Status</label>
                <select
                  name="fitness_level"
                  value={profile.fitness_level || ''}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 border border-slate-700 bg-slate-800/80 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:border-slate-600 text-slate-100 shadow-sm appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2334d399%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                >
                  <option value="" className="bg-slate-800 text-slate-300">Select level</option>
                  <option value="beginner" className="bg-slate-800 text-slate-100">Beginner</option>
                  <option value="intermediate" className="bg-slate-800 text-slate-100">Intermediate</option>
                  <option value="advanced" className="bg-slate-800 text-slate-100">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Primary Goal</label>
                <select
                  name="fitness_goal"
                  value={profile.fitness_goal || ''}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 border border-slate-700 bg-slate-800/80 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:border-slate-600 text-slate-100 shadow-sm appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2334d399%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                >
                  <option value="" className="bg-slate-800 text-slate-300">Select goal</option>
                  <option value="weight_loss" className="bg-slate-800 text-slate-100">Weight Loss</option>
                  <option value="muscle_gain" className="bg-slate-800 text-slate-100">Muscle Gain</option>
                  <option value="maintenance" className="bg-slate-800 text-slate-100">Maintenance</option>
                  <option value="endurance" className="bg-slate-800 text-slate-100">Endurance</option>
                  <option value="flexibility" className="bg-slate-800 text-slate-100">Flexibility</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end pt-8 border-t border-slate-800">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-50 rounded-xl hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] font-bold text-lg transform hover:-translate-y-0.5"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin mr-3" size={22} />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-3" size={22} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-500/30 p-8 md:p-10 relative overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-indigo-500/20 rounded-xl mr-5 border border-indigo-500/30 shadow-inner">
              <Sparkles className="text-indigo-400" size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">Profile Completion</h2>
          </div>
          <p className="text-indigo-200/80 mb-8 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Complete your profile to unlock personalized health, nutrition, and workout plans uniquely tailored to your physiological data and goals!
          </p>
          <div className="bg-slate-900/60 rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold text-slate-300 uppercase tracking-wider">Completion Status</p>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{Math.round((Object.values(profile).filter(v => v !== null && v !== undefined && v !== '').length / 15) * 100)}%</p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-4 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)] relative overflow-hidden"
                style={{ width: `${Math.round((Object.values(profile).filter(v => v !== null && v !== undefined && v !== '').length / 15) * 100)}%` }}
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -translate-x-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
