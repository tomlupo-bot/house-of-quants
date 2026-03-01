import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User } from 'lucide-react';

const ChatOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: "Systems online. I am the House of Quants core interface. How can I assist with your portfolio oversight?" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    // Placeholder response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: 'All 7 agents are operational. Processing your request through the quantum core...' }]);
    }, 1000);
  };

  return (
    <div className="fixed md:absolute top-0 md:top-20 left-0 md:left-auto right-0 md:right-6 w-full md:w-[400px] h-full md:max-h-[600px] md:h-[70vh] bg-[#0a0a0a] border-x md:border border-white/20 md:rounded-2xl shadow-2xl flex flex-col z-[100] animate-slide-in-right">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest">Quantum Core Chat</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white">
          <X className="w-5 h-5 md:w-4 md:h-4" />
        </button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${m.role === 'ai' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/10 text-white'}`}>
              {m.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-2.5 text-[11px] md:text-xs leading-relaxed ${m.role === 'ai' ? 'bg-white/5 text-white/90 rounded-tl-none border border-white/5' : 'bg-emerald-500 text-black font-medium rounded-tr-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="relative">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-xs focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-white/20" />
          <button onClick={handleSend} className="absolute right-2 top-2 p-2 text-emerald-500 hover:text-emerald-400 transition-colors">
            <Send className="w-5 h-5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
