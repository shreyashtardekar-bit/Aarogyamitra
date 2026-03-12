import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, Loader2, Bot, User, MessageCircle, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLocation } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function FloatingAICoach() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm AROMI, your AI Coach. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Don't show the floating widget on the full AI Coach page or when not logged in
  if (!isAuthenticated || location.pathname === '/ai-coach') {
    return null;
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/coach/chat', { prompt: input });
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI Coach Error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-slate-900 border border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden flex flex-col transform transition-all duration-300 origin-bottom-right h-[32rem] max-h-[80vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-4 flex justify-between items-center text-slate-50 shrink-0 border-b border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-inner">
                <Bot size={22} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">AROMI</h3>
                <p className="text-xs text-emerald-100 font-medium">Your AI Health Coach</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors relative z-10 flex items-center justify-center backdrop-blur-sm"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-950 custom-scrollbar">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-600 text-white rounded-2xl rounded-tr-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] font-medium' 
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700 shadow-md rounded-2xl rounded-tl-sm backdrop-blur-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 border border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-md flex items-center gap-3 backdrop-blur-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_5px_cyan]"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_5px_#10b981]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce shadow-[0_0_5px_#3b82f6]"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AROMI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3.5 bg-slate-900 border-t border-slate-800 shrink-0">
             <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-slate-800/80 border border-slate-700 focus:bg-slate-800 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 rounded-xl px-4 py-2.5 text-sm transition-all outline-none placeholder-slate-500 font-medium"
                  placeholder="Ask AROMI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-xl w-11 h-11 flex items-center justify-center transition-all flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5"
                >
                  <Send size={18} className={input.trim() ? '-ml-0.5 text-white' : 'text-slate-200/50'} />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center transition-all duration-300 group border border-white/10 ${
          isOpen 
            ? 'bg-rose-500/90 backdrop-blur-md hover:bg-rose-500 text-white rotate-90 scale-90 border-rose-400' 
            : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white hover:scale-110 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]'
        }`}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="relative">
            <MessageCircle size={28} className="transition-transform duration-300 group-hover:-rotate-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-[0_0_8px_#10b981]"></div>
          </div>
        )}
      </button>
    </div>
  );
}
