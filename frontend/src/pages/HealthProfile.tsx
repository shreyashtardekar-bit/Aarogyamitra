import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Heart,
  Activity,
  Brain,
  Target,
  Edit2,
  Save,
  X,
  Check
} from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitness_level: string;
  fitness_goal: string;
  health_conditions: string[];
  genetic_traits: any;
  family_history: any;
  created_at: string;
}

function HealthProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me');
      const data = response.data;
      
      // Fix stringified health conditions
      if (typeof data.health_conditions === 'string') {
        try {
          data.health_conditions = JSON.parse(data.health_conditions);
        } catch (e) {
          data.health_conditions = [data.health_conditions];
        }
      }
      if (!Array.isArray(data.health_conditions)) data.health_conditions = [];
      
      setProfile(data);
      setEditForm(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await api.put('/users/me', editForm);
      setProfile(response.data);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profile || {});
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Health Profile
            </h1>
            <p className="text-gray-600 mt-2">Manage your personal wellness information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </motion.div>

      {/* Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center"
        >
          <Check className="w-5 h-5 mr-2" />
          Profile updated successfully!
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {profile.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.age} years</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                {isEditing ? (
                  <select
                    value={editForm.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{profile.gender}</p>
                )}
              </div>
            </div>
          </div>

          {/* Physical Metrics */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Physical Metrics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.height || ''}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.height} cm</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.weight} kg</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Level</label>
                {isEditing ? (
                  <select
                    value={editForm.fitness_level || ''}
                    onChange={(e) => handleInputChange('fitness_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{profile.fitness_level}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goal</label>
                {isEditing ? (
                  <select
                    value={editForm.fitness_goal || ''}
                    onChange={(e) => handleInputChange('fitness_goal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="optimization">Optimization</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{profile.fitness_goal.replace('_', ' ')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Health Conditions */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-600" />
              Health Conditions
            </h2>
            
            {isEditing ? (
              <textarea
                value={editForm.health_conditions?.join(', ') || ''}
                onChange={(e) => handleInputChange('health_conditions', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Enter health conditions separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.health_conditions.length > 0 ? (
                  profile.health_conditions.map((condition, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      {condition}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No health conditions reported</p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Profile Stats */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Profile Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Member Since</span>
                <span className="font-medium">
                  {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Profile Complete</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between">
                <span>Data Points</span>
                <span className="font-medium">1,247</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                Export Health Data
              </button>
              <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                Connect Genetic Data
              </button>
              <button className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Wellness Score */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-200/50 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Wellness Score
            </h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">85</div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-sm text-gray-600">Excellent Health</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HealthProfile;
