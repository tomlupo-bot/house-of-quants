import React from 'react';
import { Target, Activity, Shield, Rocket, Brain, Dice1 } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="h-auto min-h-16 md:h-16 bg-black border-t border-white/10 flex flex-wrap items-center px-4 md:px-6 py-2 md:py-0 gap-4 md:gap-8 z-50 shrink-0 overflow-hidden">
    <div className="flex items-center gap-3 pr-4 md:pr-8 border-r border-white/10 shrink-0">
      <div className="p-1.5 md:p-2 bg-emerald-500/10 rounded-lg">
        <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" />
      </div>
      <div className="flex flex-col">
        <span className="text-[8px] text-white/40 uppercase tracking-tighter">Current Mission</span>
        <span className="text-[10px] md:text-xs font-bold text-white whitespace-nowrap">#117: Arbitrage Scan</span>
      </div>
      <div className="hidden sm:block ml-4 w-20 md:w-32 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 w-[78%]" />
      </div>
    </div>

    <div className="flex-1 flex items-center justify-between md:justify-start gap-4 md:gap-12 overflow-x-auto py-1">
      {[
        { icon: Activity, color: 'text-blue-400', val: '45', label: 'Signals' },
        { icon: Rocket, color: 'text-red-400', val: '12', label: 'Trades' },
        { icon: Shield, color: 'text-amber-400', val: '03', label: 'Alerts' },
        { icon: Brain, color: 'text-purple-400', val: '07', label: 'Optimizations' },
        { icon: Dice1, color: 'text-pink-400', val: '09', label: 'Predictions' },
      ].map(({ icon: Icon, color, val, label }) => (
        <div key={label} className="flex items-center gap-1 md:gap-2 shrink-0">
          <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${color}`} />
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] font-mono text-white leading-tight">{val}</span>
            <span className="text-[7px] md:text-[8px] uppercase text-white/40 tracking-tighter font-bold">{label}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="hidden sm:flex items-center gap-4 pl-4 md:pl-8 border-l border-white/10 shrink-0">
      <button className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-colors">
        Logs
      </button>
    </div>
  </footer>
);

export default Footer;
