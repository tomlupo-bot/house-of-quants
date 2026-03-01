import React from 'react';
import { TradeEvent } from '../types';
import { Search, Filter } from 'lucide-react';

const FeedView: React.FC<{ events: TradeEvent[] }> = ({ events }) => (
  <div className="h-full bg-[#050505] flex flex-col p-4 md:p-8 overflow-hidden">
    <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Market Pulse</h2>
          <p className="text-white/40 text-sm">Real-time trace of all agent operations and trade signals.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white transition-colors"><Search className="w-5 h-5" /></button>
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white transition-colors"><Filter className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
        {events.length === 0 && (
          <div className="h-full flex items-center justify-center text-white/20 italic">Synchronizing with Global Markets...</div>
        )}
        {events.map((event) => (
          <div key={event.id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.04] transition-all flex gap-4 animate-slide-in-bottom">
            <div className={`w-1.5 shrink-0 rounded-full ${
              event.type === 'TRADE' ? 'bg-red-500' :
              event.type === 'RISK' ? 'bg-amber-500' :
              event.type === 'SIGNAL' ? 'bg-blue-500' :
              event.type === 'PREDICT' ? 'bg-pink-500' :
              event.type === 'RESEARCH' ? 'bg-cyan-500' : 'bg-emerald-500'
            }`} />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase font-bold tracking-widest">{event.timestamp}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    event.type === 'TRADE' ? 'bg-red-500/10 text-red-400' :
                    event.type === 'RISK' ? 'bg-amber-500/10 text-amber-400' :
                    event.type === 'PREDICT' ? 'bg-pink-500/10 text-pink-400' :
                    event.type === 'RESEARCH' ? 'bg-cyan-500/10 text-cyan-400' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>{event.type}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400">{event.agentName}</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{event.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FeedView;
