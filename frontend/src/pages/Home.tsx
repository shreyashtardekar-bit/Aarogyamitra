import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface WellnessPlan {
  id: number;
  title: string;
  description: string;
  recommendations: string[];
}

export default function Home() {
  const [plans, setPlans] = useState<WellnessPlan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWellnessPlans();
  }, []);

  const fetchWellnessPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/wellness/plans');
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      // Add mock plans if API fails
      setPlans([
        {
          id: 1,
          title: '7-Day Detox Plan',
          description: 'Cleanse your body with healthy foods and juices',
          recommendations: [
            'Drink 8 glasses of water daily',
            'Eat 5 servings of vegetables',
            'Avoid processed foods',
            'Get 30 minutes of exercise'
          ]
        },
        {
          id: 2,
          title: '30-Day Fitness Challenge',
          description: 'Build strength and endurance with progressive workouts',
          recommendations: [
            'Exercise 45 minutes daily',
            'Focus on compound movements',
            'Rest 2 days per week',
            'Track your progress'
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/wellness/generate', {
        preferences: {
          goals: ['weight_loss', 'muscle_gain'],
          duration: 30,
          activity_level: 'moderate'
        }
      });
      
      if (response.data.plan) {
        const newPlan: WellnessPlan = {
          id: Date.now(),
          title: response.data.plan.title,
          description: response.data.plan.description,
          recommendations: response.data.plan.recommendations
        };
        setPlans([newPlan, ...plans]);
      }
    } catch (error) {
      console.error('Failed to generate plan:', error);
      alert('Failed to generate wellness plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to ArogyaMitra
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your AI-Powered Wellness Platform
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Created by Shreyash Sanjay Tardekar
          </p>
        </div>

        {/* AI Wellness Plans */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              AI Wellness Plans
            </h2>
            <button
              onClick={generatePlan}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Generating...' : 'Generate New Plan'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">AI is creating your personalized plan...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {plan.title}
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {plan.description}
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {plan.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-600 mr-2">✓</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-purple-600 text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">DNA Analysis</h3>
            <p className="text-gray-600">
              Get personalized health insights based on your genetic markers
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-purple-600 text-3xl mb-4">💪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fitness Tracking</h3>
            <p className="text-gray-600">
              Monitor your workouts, track progress, and achieve your goals
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-purple-600 text-3xl mb-4">🍎</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nutrition Plans</h3>
            <p className="text-gray-600">
              AI-powered meal plans and nutritional guidance
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">15</div>
              <p className="text-gray-600">Days Active</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">8</div>
              <p className="text-gray-600">Plans Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">92%</div>
              <p className="text-gray-600">Goal Progress</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">4.8</div>
              <p className="text-gray-600">Wellness Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
