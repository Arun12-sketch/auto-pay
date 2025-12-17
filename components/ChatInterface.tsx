import React, { useState, useRef, useEffect } from 'react';
import { AgentService, ChatMessage } from '../types';
import { generateAgentResponse } from '../services/geminiService';
import { Icons } from './Icons';

interface ChatInterfaceProps {
  service: AgentService;
  onExit: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ service, onExit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I am ${service.name}, your personal ${service.role}. Access has been granted via MNEE payment. How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await generateAgentResponse(service.systemInstruction, history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error", error);
      // Optional: Add an error message to chat if needed
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mt-6">
      {/* Chat Header */}
      <div className="bg-slate-800/80 backdrop-blur border-b border-slate-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <button onClick={onExit} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
            <Icons.ArrowLeft size={20} />
           </button>
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 border border-emerald-800">
               <Icons.Bot size={20} />
             </div>
             <div>
               <h3 className="font-semibold text-white">{service.name}</h3>
               <div className="flex items-center gap-1.5">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-xs text-emerald-400 font-medium">Session Active • Paid</span>
               </div>
             </div>
           </div>
        </div>
        <div className="hidden md:block px-3 py-1 bg-slate-950 rounded text-xs text-slate-500 border border-slate-800">
          Powered by Gemini 2.5 Flash
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
              }`}
            >
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span className={`text-[10px] block mt-2 opacity-60 ${msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none p-4 flex items-center gap-3 shadow-lg">
              <Icons.Loader2 className="animate-spin text-emerald-500" size={18} />
              <span className="text-slate-400 text-sm font-medium">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your instruction..."
            disabled={isTyping}
            className="flex-1 bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-3 rounded-xl transition-all flex items-center justify-center min-w-[50px]"
          >
            {isTyping ? <Icons.Loader2 className="animate-spin" size={20} /> : <Icons.Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;