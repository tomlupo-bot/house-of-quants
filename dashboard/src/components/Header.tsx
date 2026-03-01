import React, { useState, useEffect } from 'react';
import { Power, MessageSquare, RefreshCw, BarChart3, List, Briefcase, Users, PieChart, Vault } from 'lucide-react';
import { TabId } from '../types';

interface HeaderProps {
  onToggleChat: () => void;
  eventCount: number;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleChat, eventCount, activeTab, onTabChange }) => {
  const [countdown, setCountdown] = useState(28);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: TabId; label: string; icon: React.FC<any> }[] = [
    { id: 'feed', label: 'Feed', icon: List },
    { id: 'tasks', label: 'Tasks', icon: Briefcase },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'treasury', label: 'Treasury', icon: Vault },
  ];

  return (
    <header className="bg-black border-b border-white/10 flex flex-col z-50 shrink-0">
      <div className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/5">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-black" />
            </div>
            <h1 className="text-sm md:text-xl font-bold tracking-tighter text-white truncate">HQ ARENA</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{eventCount} Events</span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] text-white/40 uppercase tracking-tighter">Cycle</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">{countdown}s</span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
            <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/60" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={onToggleChat} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/60" title="Chat">
              <MessageSquare className="w-4 h-4" />
            </button>
            <button className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md transition-colors" title="Exit">
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <nav className="flex px-2 md:px-6 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center gap-2 px-4 py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === item.id ? 'text-emerald-400' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            {activeTab === item.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            )}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
