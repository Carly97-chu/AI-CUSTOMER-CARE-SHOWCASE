import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Bot, User, AlertCircle } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your TechFlow virtual assistant. How can I help you with your X-2000 device today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(userMessage.text, history);
      
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'I\'m sorry, a connection error occurred. Please try again later.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-2xl mx-auto bg-surface rounded-xl shadow-2xl overflow-hidden border border-white/5 animate-fade-in-up">
      {/* Header */}
      <div className="bg-surfaceHighlight/50 p-4 border-b border-white/5 flex items-center justify-between backdrop-blur-sm">
        <button onClick={onBack} className="text-textMuted hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-success animate-ping"></div>
          </div>
          <h3 className="font-semibold text-white text-sm tracking-wide">TechFlow Assistant</h3>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-surfaceHighlight text-textMuted' : 'bg-primary/10 text-primary'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white' 
                  : msg.isError 
                    ? 'bg-error/10 text-error border border-error/20' 
                    : 'bg-surfaceHighlight text-textMain border border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex max-w-[85%] gap-4 flex-row">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                 <Bot size={18} />
              </div>
              <div className="bg-surfaceHighlight p-4 rounded-xl border border-white/5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce delay-200"></span>
              </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surfaceHighlight/30 border-t border-white/5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="w-full bg-surface text-white rounded-lg py-3.5 px-5 pr-12 focus:outline-none focus:ring-1 focus:ring-primary border border-white/5 placeholder-textMuted text-sm shadow-inner transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 text-primary hover:text-white hover:bg-primary rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-center mt-3">
           <p className="text-[10px] uppercase tracking-widest text-textMuted flex items-center justify-center gap-1.5">
             <AlertCircle size={10} />
             Demo Mode: Try "Restart" or "Error E-500"
           </p>
        </div>
      </div>
    </div>
  );
};