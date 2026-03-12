import React, { useState, useEffect } from 'react';

export default function TestPage() {
  const [status, setStatus] = useState({});
  const [error, setError] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  useEffect(() => {
    testBackend();
  }, []);

  const testBackend = async () => {
    try {
      // Test health endpoint
      const healthResponse = await fetch('http://127.0.0.1:8000/health');
      const healthData = await healthResponse.json();
      
      // Test chat endpoint
      const chatResponse = await fetch('http://127.0.0.1:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello AROMI AI!', context: null })
      });
      const chatData = await chatResponse.json();

      setStatus({
        backend: healthResponse.ok,
        chat: chatResponse.ok,
        health: healthData,
        chatResponse: chatData
      });
    } catch (err) {
      setError('Backend connection failed: ' + err.message);
    }
  };

  const sendChat = async () => {
    if (!chatMessage.trim()) return;
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatMessage, context: null })
      });
      
      const data = await response.json();
      setChatResponse(data.message || 'No response');
      setChatMessage('');
    } catch (err) {
      setError('Chat failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">AROMI AI Test Page</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Status Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Server Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${status.backend ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Backend: {status.backend ? '✅ Connected' : '❌ Disconnected'}
            </div>
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${status.chat ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Chat API: {status.chat ? '✅ Working' : '❌ Failed'}
            </div>
          </div>
          
          {status.health && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <strong>Backend Health:</strong> {JSON.stringify(status.health)}
            </div>
          )}
        </div>

        {/* Chat Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Chat Test</h2>
          
          <div className="mb-4">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a message to test AROMI AI..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && sendChat()}
            />
            <button
              onClick={sendChat}
              className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Send Message
            </button>
          </div>

          {chatResponse && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <strong>AROMI AI Response:</strong>
              <p className="mt-2">{chatResponse}</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = '/pages/AROMIFixedChat'}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Go to Fixed Chat Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Go to Main Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
