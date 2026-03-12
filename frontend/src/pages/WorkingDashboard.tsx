import React, { useState, useEffect } from 'react';

export default function WorkingDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600">Please log in to view your dashboard.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 mt-4"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.username || 'User'}!
              </h1>
              <p className="text-gray-600">
                Your AI-powered wellness dashboard
              </p>
            </div>
            <button
              onClick={() => alert('AI Plan Generated!')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Generate AI Plan
            </button>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🤖</span>
            AI Health Insights
          </h2>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <p className="text-gray-800 leading-relaxed">
              Based on your health data, you're making excellent progress! Your sleep quality has improved by 23% this month, and your daily step average of 8,500 exceeds WHO recommendations. Keep up the great work with your exercise routine and balanced nutrition.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-green-100 rounded p-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ Strengths</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Consistent exercise routine</li>
                  <li>• Good sleep patterns</li>
                  <li>• Regular activity tracking</li>
                </ul>
              </div>
              <div className="bg-blue-100 rounded p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🎯 Recommendations</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Increase water intake by 2 glasses</li>
                  <li>• Add strength training 2x/week</li>
                  <li>• Maintain current sleep schedule</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Weight Tracking */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">⚖️</span>
              Weight Tracking
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-10</span>
                <span className="font-semibold text-gray-900">75.0 kg</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-09</span>
                <span className="font-semibold text-gray-900">75.5 kg</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-08</span>
                <span className="font-semibold text-gray-900">76.0 kg</span>
              </div>
            </div>
            <div className="mt-4 bg-green-50 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                📉 Trend: -1.5kg this month
              </p>
            </div>
          </div>

          {/* Activity Tracking */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">👟</span>
              Activity Tracking
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-10</span>
                <span className="font-semibold text-gray-900">8,500 steps</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-09</span>
                <span className="font-semibold text-gray-900">6,200 steps</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-08</span>
                <span className="font-semibold text-gray-900">9,100 steps</span>
              </div>
            </div>
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 font-semibold">
                📈 Average: 7,933 steps/day
              </p>
            </div>
          </div>
        </div>

        {/* Sleep & Nutrition */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sleep Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">😴</span>
              Sleep Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-10</span>
                <span className="font-semibold text-gray-900">7.5 hours</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-09</span>
                <span className="font-semibold text-gray-900">6.8 hours</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-08</span>
                <span className="font-semibold text-gray-900">8.2 hours</span>
              </div>
            </div>
            <div className="mt-4 bg-purple-50 rounded-lg p-4">
              <p className="text-purple-800 font-semibold">
                🛌 Average: 7.5 hours/night
              </p>
            </div>
          </div>

          {/* Nutrition Tracking */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🥗</span>
              Nutrition Tracking
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-10</span>
                <span className="font-semibold text-gray-900">2,200 cal</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-09</span>
                <span className="font-semibold text-gray-900">1,900 cal</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">2024-03-08</span>
                <span className="font-semibold text-gray-900">2,400 cal</span>
              </div>
            </div>
            <div className="mt-4 bg-orange-50 rounded-lg p-4">
              <p className="text-orange-800 font-semibold">
                🍎 Average: 2,100 calories/day
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button 
              onClick={() => alert('Meal logging feature coming soon!')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-bold mb-2">Log Meal</h3>
              <p className="text-sm">Track nutrition</p>
            </button>
            
            <button 
              onClick={() => alert('Workout logging feature coming soon!')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">💪</div>
              <h3 className="font-bold mb-2">Log Workout</h3>
              <p className="text-sm">Record exercise</p>
            </button>
            
            <button 
              onClick={() => alert('Sleep tracking feature coming soon!')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">🧘</div>
              <h3 className="font-bold mb-2">Log Sleep</h3>
              <p className="text-sm">Track rest quality</p>
            </button>
          </div>
        </div>

        {/* AI Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-3">🧠</span>
                DNA Analysis
              </h3>
              <p className="text-gray-700 mb-4">
                Get personalized health insights based on your genetic markers and predispositions.
              </p>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
                Upload DNA Data
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-3">🤖</span>
                AI Chat Coach
              </h3>
              <p className="text-gray-700 mb-4">
                Get instant wellness advice from our AI-powered health coach.
              </p>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                Start AI Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
