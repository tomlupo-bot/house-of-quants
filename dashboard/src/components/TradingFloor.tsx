import React, { useState, useEffect } from 'react';
import { Agent, AgentStatus } from '../types';
import { INITIAL_AGENTS, getRandomStatus } from '../constants';
import { useAgents } from '../hooks/useHoQ';

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'analyzing': return 'border-blue-500 shadow-blue-500/20';
      case 'profitable': return 'border-emerald-500 shadow-emerald-500/20';
      case 'warning': return 'border-amber-500 shadow-amber-500/20';
      default: return 'border-white/20 shadow-transparent';
    }
  };

  return (
    <div className="absolute transition-all duration-1000 ease-in-out group"
      style={{ left: `${agent.x}%`, top: `${agent.y}%`, transform: 'translate(-50%, -50%)' }}>
      <div className="absolute -top-14 md:-top-16 left-1/2 -translate-x-1/2 bg-white/90 text-black px-2 md:px-3 py-1 md:py-1.5 rounded-2xl rounded-bl-none text-[8px] md:text-[10px] font-bold w-24 md:w-32 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        {agent.lastThought}
        <div className="absolute -bottom-1 left-0 w-2 h-2 bg-white/90 rotate-45" />
      </div>
      <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl border-2 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500 ${getStatusColor(agent.status)} hover:scale-110 cursor-pointer`}>
        {agent.status === 'analyzing' && (
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-blue-400 animate-ping opacity-20" />
        )}
        <span className="text-2xl md:text-3xl filter drop-shadow-md select-none">{agent.emoji}</span>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-black border border-white/20 rounded-full flex items-center justify-center">
          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${agent.status === 'profitable' ? 'bg-emerald-500' : agent.status === 'analyzing' ? 'bg-blue-500' : 'bg-white/20'}`} />
        </div>
      </div>
      <div className="mt-1 md:mt-2 text-center overflow-hidden">
        <p className="text-[9px] md:text-[11px] font-bold text-white tracking-tight truncate max-w-[60px] md:max-w-none mx-auto">{agent.name}</p>
        <p className="hidden md:block text-[9px] text-white/40 uppercase font-mono">{agent.role}</p>
      </div>
    </div>
  );
};

const TradingFloor: React.FC = () => {
  const convexAgents = useAgents();

  const baseAgents: Agent[] = convexAgents && convexAgents.length > 0
    ? convexAgents.map((a, i) => ({
        id: a.agentId,
        name: a.name,
        role: a.role,
        status: a.status as AgentStatus,
        emoji: a.emoji,
        lastThought: a.lastThought,
        color: a.color,
        x: 15 + (i % 4) * 22,
        y: 25 + Math.floor(i / 4) * 35,
      }))
    : INITIAL_AGENTS;

  const [agents, setAgents] = useState<Agent[]>(baseAgents);

  useEffect(() => {
    setAgents(baseAgents);
  }, [convexAgents]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(a => ({
        ...a,
        status: Math.random() > 0.7 ? getRandomStatus() : a.status,
        x: Math.min(90, Math.max(10, a.x + (Math.random() - 0.5) * 0.8)),
        y: Math.min(90, Math.max(10, a.y + (Math.random() - 0.5) * 0.8)),
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_70%)] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <linearGradient id="flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {agents.slice(0, -1).map((a, i) => {
          const b = agents[i + 1];
          return (
            <g key={`flow-${i}`}>
              <line x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
                stroke="url(#flow)" strokeWidth="1" strokeDasharray="5,5" />
            </g>
          );
        })}
        <circle r="2" fill="#10b981">
          <animateMotion dur="3s" repeatCount="indefinite"
            path={`M ${agents[0].x * 5} ${agents[0].y * 3} L ${agents[1].x * 5} ${agents[1].y * 3} L ${agents[2].x * 5} ${agents[2].y * 3}`} />
        </circle>
      </svg>
      {agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
      <div className="absolute bottom-4 left-4 pointer-events-none opacity-10 flex items-center gap-2">
        <span className="text-[8px] md:text-[10px] font-mono uppercase tracking-[0.2em]">Q-ARENA_V4</span>
      </div>
    </div>
  );
};

export default TradingFloor;
