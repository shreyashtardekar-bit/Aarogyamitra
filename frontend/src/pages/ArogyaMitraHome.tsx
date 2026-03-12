import React, { useState, useEffect } from 'react';

export default function ArogyaMitraHome() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  useEffect(() => {
    // Load ArogyaMitra wellness plans
    fetchArogyaMitraPlans();
  }, []);

  const fetchArogyaMitraPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/wellness/plans');
      const data = await response.json();
      
      if (data.platform === 'ArogyaMitra') {
        setPlans(data.plans || []);
      } else {
        // Mock ArogyaMitra plans if API fails
        setPlans([
          {
            id: 1,
            title: 'ArogyaMitra 7-Day Detox Plan',
            description: 'Cleanse your body with healthy foods and juices using ArogyaMitra AI guidance',
            duration_days: 7,
            difficulty: 'easy',
            features: ['AI nutrition guidance', 'Detox support', 'Progress tracking']
          },
          {
            id: 2,
            title: 'ArogyaMitra 30-Day Fitness Challenge',
            description: 'Build strength and endurance with ArogyaMitra progressive workout plans',
            duration_days: 30,
            difficulty: 'medium',
            features: ['AI workout plans', 'Progress tracking', 'Achievement badges']
          },
          {
            id: 3,
            title: 'ArogyaMitra Sleep Optimization',
            description: 'Improve sleep quality and duration with ArogyaMitra smart analysis',
            duration_days: 21,
            difficulty: 'easy',
            features: ['AI sleep analysis', 'Bedtime reminders', 'Quality tracking']
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch ArogyaMitra plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateArogyaMitraPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/wellness/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'arogyamitra-test-token'}`
        },
        body: JSON.stringify({
          goals: ['weight_loss', 'muscle_tone', 'better_sleep'],
          duration: 30,
          activity_level: 'moderate',
          preferences: ['vegetarian', 'morning_workout', 'meditation']
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.platform === 'ArogyaMitra') {
        const newPlan = {
          id: Date.now(),
          title: data.plan.title,
          description: data.plan.description,
          recommendations: data.plan.recommendations,
          created_at: data.plan.created_at,
          generated_by: data.generated_by
        };
        setPlans([newPlan, ...plans]);
        setAiMessage('New ArogyaMitra wellness plan generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate ArogyaMitra plan:', error);
      setAiMessage('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chatWithArogyaMitraAI = async () => {
    const message = prompt('Ask ArogyaMitra AI anything about your health:');
    if (!message) return;
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'arogyamitra-test-token'}`
        },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      
      if (data.success && data.platform === 'ArogyaMitra') {
        alert(`ArogyaMitra AI: ${data.ai_response}`);
      }
    } catch (error) {
      console.error('ArogyaMitra AI chat error:', error);
      alert('Failed to connect to ArogyaMitra AI. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ArogyaMitra Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to ArogyaMitra
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Next-Gen AI Wellness Platform
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Created by Shreyash Sanjay Tardekar
          </p>
          <div className="flex justify-center space-x-8">
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
              🧠 AI Powered
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              🌱 Real APIs
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              🤖 Modern Tech
            </div>
          </div>
        </div>

        {/* AI Message */}
        {aiMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-green-800 font-semibold text-center">
              ✅ {aiMessage}
            </p>
          </div>
        )}

        {/* ArogyaMitra AI Wellness Plans */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              ArogyaMitra AI Wellness Plans
            </h2>
            <button
              onClick={generateArogyaMitraPlan}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Generating...' : 'Generate ArogyaMitra AI Plan'}
            </button>
            <button
              onClick={chatWithArogyaMitraAI}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 ml-4 transition-colors"
            >
              Chat with ArogyaMitra AI
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">ArogyaMitra AI is creating your personalized plan...</p>
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
                    <h4 className="font-semibold text-gray-800 mb-2">ArogyaMitra Recommendations:</h4>
                    <ul className="space-y-2">
                      {(plan.recommendations || []).map((rec: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-600 mr-2">✓</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Generated by: {plan.generated_by}</p>
                    <p>Created: {new Date(plan.created_at).toLocaleString()}</p>
                    {plan.features && (
                      <div className="mt-2">
                        <span className="font-semibold">Features: </span>
                        {plan.features.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ArogyaMitra Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-purple-600 text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ArogyaMitra DNA Analysis</h3>
            <p className="text-gray-600">
              Get personalized health insights based on your genetic markers
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-purple-600 text-3xl mb-4">💪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ArogyaMitra Fitness Tracking</h3>
            <p className="text-gray-600">
              Monitor your workouts with ArogyaMitra AI guidance
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-purple-600 text-3xl mb-4">🍎</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ArogyaMitra Nutrition</h3>
            <p className="text-gray-600">
              AI-powered meal plans and nutritional guidance
            </p>
          </div>
        </div>

        {/* ArogyaMitra Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ArogyaMitra Platform Stats</h2>
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
              <p className="text-gray-600">ArogyaMitra Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
