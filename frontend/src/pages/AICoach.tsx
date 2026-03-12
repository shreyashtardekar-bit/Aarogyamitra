import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, Loader2, Bot, User, Sparkles, MessageCircle, Zap } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Create a workout plan for a beginner',
  'What should I eat for muscle gain?',
  'How to improve flexibility?',
  'Best exercises for a strong core'
];

function AICoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { loadChatHistory(); }, []);
  useEffect(() => { scrollToBottom(); }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/coach/history');
      if (response.data.length === 0) {
        setMessages([{ role: 'assistant', content: 'Hello! I am AROMI, your ArogyaMitra AI Coach! 🌟 I\'m here to help you with fitness, nutrition, and wellness advice. How can I assist you today?' }]);
      } else {
        setMessages(response.data);
      }
    } catch (error: any) {
      setMessages([{ role: 'assistant', content: 'Hello! I am AROMI, your ArogyaMitra AI Coach! 🌟 I\'m here to help you achieve your wellness goals. How can I help you today?' }]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const msg = input;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    try {
      const response = await api.post('/coach/chat', { prompt: msg });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error: any) {
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error.request && !error.response) errorMessage = '❌ Cannot connect to backend. Ensure the server is running.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto animate-fadeIn">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-5 px-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_16px_rgba(251,191,36,0.3)] flex-shrink-0">
          <Bot size={18} className="text-zinc-900" />
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-semibold">AI Coach</p>
          <h1 className="text-xl font-black text-white tracking-tight">AROMI Health Coach</h1>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-widest">Online</span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 space-y-4 mb-4">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mx-auto" />
              <p className="text-zinc-500 text-sm font-medium">Loading chat history...</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-400 to-emerald-400'
                      : 'bg-zinc-800 border border-zinc-700'
                  }`}>
                    {msg.role === 'user'
                      ? <User size={14} className="text-zinc-900" />
                      : <Bot size={14} className="text-amber-400" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-zinc-800 text-white border border-zinc-700/50 rounded-tr-sm'
                      : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl flex-shrink-0 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Bot size={14} className="text-amber-400" />
                  </div>
                  <div className="px-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    {[0, 150, 300].map(delay => (
                      <div key={delay} className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ── Suggestions ── */}
      {messages.length <= 1 && !loading && !loadingHistory && (
        <div className="mb-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles size={12} className="text-amber-400" />
            <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-widest">Try asking</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setInput(s)}
                className="px-3 py-1.5 text-xs font-medium bg-zinc-800/60 text-zinc-400 border border-zinc-700/50 rounded-xl hover:border-amber-500/30 hover:text-amber-300 hover:bg-zinc-800 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className="flex gap-2.5">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full px-4 py-3.5 pr-10 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 outline-none transition-all hover:border-zinc-700 focus:border-amber-500/50 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.08)] disabled:opacity-50"
            placeholder="Ask AROMI about fitness, nutrition, health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <MessageCircle size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-700" />
        </div>
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-5 py-3.5 bg-gradient-to-r from-amber-400 to-orange-400 text-zinc-900 rounded-xl font-bold text-sm hover:from-amber-300 hover:to-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_12px_rgba(251,191,36,0.2)] hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
        >
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
}

export default AICoach;
