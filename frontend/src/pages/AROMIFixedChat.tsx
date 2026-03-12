import React, { useState, useEffect } from 'react';

export default function AROMIFixedChat() {
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [nutritionPlan, setNutritionPlan] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    // Check backend status
    checkBackendStatus();
    // Load initial chat history
    loadChatHistory();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/health');
      if (response.ok) {
        setBackendStatus('connected');
        setError('');
      } else {
        setBackendStatus('disconnected');
        setError('Backend not responding');
      }
    } catch (error) {
      setBackendStatus('disconnected');
      setError('Cannot connect to backend');
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/coach/history');
      const data = await response.json();
      if (data.platform === 'AROMI AI') {
        setChatHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const generateWorkoutPlan = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/workout/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'aromi-test-token'}`
        },
        body: JSON.stringify({
          fitness_level: 'intermediate',
          goals: ['muscle_gain', 'fat_loss'],
          duration: 30,
          equipment: ['dumbbells', 'resistance_bands']
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.platform === 'AROMI AI') {
        setWorkoutPlan(data.workout_plan);
        setError('');
      } else {
        setError('Failed to generate workout plan');
      }
    } catch (error) {
      console.error('Workout plan error:', error);
      setError('Failed to connect to AROMI AI');
    } finally {
      setLoading(false);
    }
  };

  const generateNutritionPlan = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/nutrition/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'aromi-test-token'}`
        },
        body: JSON.stringify({
          dietary_preferences: ['balanced'],
          goals: ['weight_loss', 'muscle_gain'],
          calories_target: 2000,
          allergies: []
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.platform === 'AROMI AI') {
        setNutritionPlan(data.nutrition_plan);
        setError('');
      } else {
        setError('Failed to generate nutrition plan');
      }
    } catch (error) {
      console.error('Nutrition plan error:', error);
      setError('Failed to connect to AROMI AI');
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Sending chat message:', chatMessage);
      
      // Try the new API endpoint first
      let response = await fetch('http://127.0.0.1:8000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'aromi-test-token'}`
        },
        body: JSON.stringify({
          message: chatMessage,
          context: chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].response : null
        })
      });
      
      let data = await response.json();
      console.log('Chat API response:', data);
      
      if (!data.success) {
        // Try the old endpoint
        response = await fetch('http://127.0.0.1:8000/coach/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || 'aromi-test-token'}`
          },
          body: JSON.stringify({
            message: chatMessage,
            context: chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].response : null
          })
        });
        
        data = await response.json();
        console.log('Coach chat API response:', data);
      }
      
      if (data.success && (data.platform === 'AROMI AI' || data.message)) {
        const newChat = {
          id: Date.now(),
          date: new Date().toISOString(),
          message: chatMessage,
          response: data.message || data.ai_response || 'AI response received',
          generated_by: data.generated_by || 'AROMI AI'
        };
        
        setChatHistory([newChat, ...chatHistory]);
        setChatMessage('');
        setError('');
      } else {
        setError('Failed to send message');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to connect to AROMI AI chat');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'aromi-test-token'}`
        },
        body: JSON.stringify({
          message: 'Hello AROMI AI, can you hear me?',
          context: null
        })
      });
      
      const data = await response.json();
      console.log('Test connection response:', data);
      
      if (data.success) {
        alert('✅ Chatbot is working! Response: ' + (data.message || data.ai_response));
      } else {
        alert('❌ Chatbot test failed');
      }
    } catch (error) {
      console.error('Test connection error:', error);
      alert('❌ Failed to test chatbot connection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* AROMI AI Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AROMI AI - Fixed Chatbot
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Next-Gen AI Wellness Platform - Real API Integration
          </p>
          
          {/* Backend Status */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              backendStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              Backend: {backendStatus === 'connected' ? '✅ Connected' : '❌ Disconnected'}
            </div>
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
              🤖 Real Groq AI
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              🍎 Spoonacular API
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-800 font-semibold text-center">
              ❌ {error}
            </p>
          </div>
        )}

        {/* Test Connection Button */}
        <div className="text-center mb-8">
          <button
            onClick={testConnection}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Chatbot Connection
          </button>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Workout Plan Generator */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">💪</span>
              Workout Plan Generator
            </h2>
            
            <button
              onClick={generateWorkoutPlan}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors mb-6"
            >
              {loading ? 'Generating...' : 'Generate Workout Plan'}
            </button>
            
            {workoutPlan && (
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-4">
                  {workoutPlan.title}
                </h3>
                <p className="text-gray-700 mb-4 whitespace-pre-line">
                  {workoutPlan.description}
                </p>
                <div className="text-sm text-gray-600">
                  <p>Duration: {workoutPlan.duration} days</p>
                  <p>Level: {workoutPlan.fitness_level}</p>
                  <p>Generated by: {workoutPlan.generated_by}</p>
                </div>
              </div>
            )}
          </div>

          {/* Nutrition Plan Generator */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🍎</span>
              Nutrition Plan Generator
            </h2>
            
            <button
              onClick={generateNutritionPlan}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors mb-6"
            >
              {loading ? 'Generating...' : 'Generate Nutrition Plan'}
            </button>
            
            {nutritionPlan && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-900 mb-4">
                  {nutritionPlan.title}
                </h3>
                <p className="text-gray-700 mb-4">
                  {nutritionPlan.description}
                </p>
                
                {nutritionPlan.meals && nutritionPlan.meals.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Daily Meals:</h4>
                    {nutritionPlan.meals.map((meal, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-2">{meal.title}</h5>
                        <p className="text-sm text-gray-600 mb-2">{meal.instructions}</p>
                        <div className="text-xs text-gray-500">
                          <span>Calories: {meal.calories}</span> | 
                          <span> Protein: {meal.protein}g</span> | 
                          <span> Carbs: {meal.carbs}g</span> | 
                          <span> Fat: {meal.fat}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-sm text-gray-600 mt-4">
                  <p>Generated by: {nutritionPlan.generated_by}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Chatbot - FIXED */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🤖</span>
            AROMI AI Chatbot - FIXED
          </h2>
          
          {/* Chat Messages */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 h-96 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>No chat history yet. Start a conversation with AROMI AI!</p>
                <p className="mt-2 text-sm">Try asking: "How can I improve my fitness?"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className="space-y-2">
                    <div className="bg-blue-100 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-800 mb-1">You:</p>
                      <p className="text-gray-700">{chat.message}</p>
                    </div>
                    <div className="bg-purple-100 rounded-lg p-4">
                      <p className="text-sm font-semibold text-purple-800 mb-1">
                        AROMI AI ({chat.generated_by}):
                      </p>
                      <p className="text-gray-700 whitespace-pre-line">{chat.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="flex space-x-4">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Ask AROMI AI anything about health, fitness, or nutrition..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <button
              onClick={sendChatMessage}
              disabled={loading || !chatMessage.trim()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
          
          {/* Debug Info */}
          <div className="mt-4 text-xs text-gray-500">
            <p>Debug: Backend Status: {backendStatus}</p>
            <p>Try the "Test Chatbot Connection" button if chat is not working</p>
          </div>
        </div>

        {/* Status Display */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AROMI AI Status</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💪</div>
              <h3 className="font-bold text-gray-900">Workout Plans</h3>
              <p className="text-green-600 font-semibold">
                {workoutPlan ? '✅ Working' : 'Ready'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🍎</div>
              <h3 className="font-bold text-gray-900">Nutrition Plans</h3>
              <p className="text-green-600 font-semibold">
                {nutritionPlan ? '✅ Working' : 'Ready'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-bold text-gray-900">AI Chatbot</h3>
              <p className="text-green-600 font-semibold">
                {backendStatus === 'connected' ? '✅ Working' : '❌ Disconnected'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
