import React from 'react';
import { Wallet, TrendingDown, PieChart, Flame, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCapital } from '../hooks/useHoQ';

const MOCK_ALLOCATIONS = [
  { name: 'Active Trading', pct: 40, color: '#10b981', amount: '$200,000' },
  { name: 'Prediction Markets', pct: 20, color: '#ec4899', amount: '$100,000' },
  { name: 'DeFi Yield', pct: 15, color: '#8b5cf6', amount: '$75,000' },
  { name: 'Stablecoins Reserve', pct: 15, color: '#3b82f6', amount: '$75,000' },
  { name: 'Research Budget', pct: 10, color: '#06b6d4', amount: '$50,000' },
];

const POOL_COLORS: Record<string, string> = {
  'Active Trading': '#10b981',
  'Prediction Markets': '#ec4899',
  'DeFi Yield': '#8b5cf6',
  'Stablecoins Reserve': '#3b82f6',
  'Research Budget': '#06b6d4',
};

const Treasury: React.FC = () => {
  const convexCapital = useCapital();

  const hasLiveData = convexCapital && convexCapital.length > 0;
  const totalCapital = hasLiveData
    ? convexCapital.reduce((sum, c) => sum + c.amount, 0)
    : 500000;

  const allocations = hasLiveData
    ? convexCapital.map(c => ({
        name: c.pool,
        pct: totalCapital > 0 ? Math.round((c.amount / totalCapital) * 100) : 0,
        color: POOL_COLORS[c.pool] || '#6b7280',
        amount: `$${c.amount.toLocaleString()}`,
      }))
    : MOCK_ALLOCATIONS;

  return (
    <div className="h-full bg-[#050505] p-4 md:p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Wallet, color: 'emerald', label: 'Total Capital', value: `$${totalCapital.toLocaleString()}`, sub: `Deployed across ${allocations.length} pools` },
            { icon: TrendingDown, color: 'red', label: 'Monthly Burn', value: '$2,140', sub: 'API + infra + data feeds' },
            { icon: ArrowUpRight, color: 'emerald', label: 'Monthly Revenue', value: '$18,492', sub: '+12.4% vs last month' },
            { icon: Flame, color: 'amber', label: 'Runway', value: '∞', sub: 'Revenue > burn' },
          ].map(({ icon: Icon, color, label, value, sub }) => (
            <div key={label} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 text-${color}-500`} />
              </div>
              <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest">{label}</span>
              <p className="text-2xl font-black text-white font-mono mt-1">{value}</p>
              <p className="text-[10px] text-white/30 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <PieChart className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-white">Capital Allocation</h3>
            {hasLiveData && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">LIVE</span>}
          </div>

          <div className="flex h-4 rounded-full overflow-hidden mb-8">
            {allocations.map((a) => (
              <div key={a.name} style={{ width: `${a.pct}%`, backgroundColor: a.color }} className="transition-all" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allocations.map((a) => (
              <div key={a.name} className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-white/5">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">{a.name}</p>
                  <p className="text-[10px] text-white/30">{a.pct}% allocation</p>
                </div>
                <span className="font-mono text-sm font-bold text-white">{a.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Recent Treasury Movements</h3>
          <div className="space-y-3">
            {[
              { dir: 'in', amount: '+$4,200', desc: 'Trading profits — Blitz Bot', time: '2h ago' },
              { dir: 'out', amount: '-$890', desc: 'API costs — OpenRouter + data feeds', time: '6h ago' },
              { dir: 'in', amount: '+$1,340', desc: 'Prediction market settlement — Oracle', time: '12h ago' },
              { dir: 'out', amount: '-$250', desc: 'Infrastructure — Convex + Vercel', time: '1d ago' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-black/20 rounded-xl">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.dir === 'in' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {tx.dir === 'in' ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">{tx.desc}</p>
                  <p className="text-[10px] text-white/30">{tx.time}</p>
                </div>
                <span className={`font-mono font-bold text-sm ${tx.dir === 'in' ? 'text-emerald-400' : 'text-red-400'}`}>{tx.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treasury;
