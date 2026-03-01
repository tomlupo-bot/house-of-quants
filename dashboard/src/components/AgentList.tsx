import React from 'react';
import { INITIAL_AGENTS } from '../constants';
import { useAgents } from '../hooks/useHoQ';
import { Shield, Zap, TrendingUp, Clock, Terminal } from 'lucide-react';

const AgentList: React.FC = () => {
  const convexAgents = useAgents();

  const agents = convexAgents && convexAgents.length > 0
    ? convexAgents.map(a => ({
        id: a.agentId,
        name: a.name,
        role: a.role,
        status: a.status as any,
        emoji: a.emoji,
        lastThought: a.lastThought,
        color: a.color,
        x: 50, y: 50,
      }))
    : INITIAL_AGENTS;

  return (
    <div className="absolute inset-0 bg-[#050505] overflow-y-auto p-4 md:p-8 custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Terminal className="w-6 h-6 text-emerald-500" />
              Active Agent Roster
            </h2>
            <p className="text-white/40 text-sm mt-1">Detailed operational metrics for all active quantum entities.</p>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Total Agents: {agents.length}</span>
            </div>
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md">
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                {convexAgents && convexAgents.length > 0 ? 'LIVE' : 'DEMO'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 md:p-6 hover:bg-white/[0.04] transition-all group relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                agent.status === 'profitable' ? 'bg-emerald-500' :
                agent.status === 'analyzing' ? 'bg-blue-500' :
                agent.status === 'warning' ? 'bg-amber-500' : 'bg-white/20'
              }`} />
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                    {agent.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{agent.name}</h3>
                    <p className="text-white/40 text-xs uppercase font-mono tracking-wider">{agent.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        agent.status === 'profitable' ? 'bg-emerald-500' :
                        agent.status === 'analyzing' ? 'bg-blue-500' : 'bg-white/20'
                      }`} />
                      <span className="text-[10px] uppercase font-bold text-white/60 tracking-tighter">{agent.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 py-2 border-t md:border-t-0 md:border-l border-white/5 md:pl-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/30 uppercase font-bold flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Efficiency</span>
                    <span className="text-sm font-bold text-white mt-0.5">94.2%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/30 uppercase font-bold flex items-center gap-1.5"><Zap className="w-3 h-3" /> Latency</span>
                    <span className="text-sm font-bold text-white mt-0.5">14ms</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/30 uppercase font-bold flex items-center gap-1.5"><Shield className="w-3 h-3" /> Security</span>
                    <span className="text-sm font-bold text-emerald-400 mt-0.5">OPTIMAL</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/30 uppercase font-bold flex items-center gap-1.5"><Clock className="w-3 h-3" /> Activity</span>
                    <span className="text-sm font-bold text-white mt-0.5 whitespace-nowrap">2m ago</span>
                  </div>
                </div>

                <div className="md:w-64 bg-black/40 rounded-xl p-3 border border-white/5">
                  <span className="text-[9px] text-white/20 uppercase font-bold mb-1 block">Current Stack Trace</span>
                  <p className="text-[11px] text-white/60 font-mono leading-relaxed italic">"{agent.lastThought}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentList;
