import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Layers } from 'lucide-react';
import { usePositions, useEquity } from '../hooks/useHoQ';

const MOCK_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', weight: 45, value: '$124,592', change: '+2.4%', up: true, color: 'bg-orange-500' },
  { symbol: 'ETH', name: 'Ethereum', weight: 30, value: '$82,104', change: '+1.8%', up: true, color: 'bg-blue-500' },
  { symbol: 'SOL', name: 'Solana', weight: 15, value: '$41,052', change: '-0.5%', up: false, color: 'bg-purple-500' },
  { symbol: 'USDT', name: 'Tether', weight: 10, value: '$27,368', change: '0.0%', up: true, color: 'bg-emerald-500' },
];

const SYMBOL_COLORS: Record<string, string> = {
  BTC: 'bg-orange-500', ETH: 'bg-blue-500', SOL: 'bg-purple-500', USDT: 'bg-emerald-500',
};

const PortfolioView: React.FC = () => {
  const convexPositions = usePositions();
  const convexEquity = useEquity();

  const hasLivePositions = convexPositions && convexPositions.length > 0;

  const totalValue = hasLivePositions
    ? convexPositions.reduce((sum, p) => sum + p.size * (p.currentPrice ?? p.entryPrice), 0)
    : 275116.42;

  const totalPnl = hasLivePositions
    ? convexPositions.reduce((sum, p) => sum + (p.pnl ?? 0), 0)
    : 12491.12;

  const assets = hasLivePositions
    ? convexPositions.map(p => {
        const val = p.size * (p.currentPrice ?? p.entryPrice);
        const pnlPct = p.entryPrice > 0 ? (((p.currentPrice ?? p.entryPrice) - p.entryPrice) / p.entryPrice * 100) : 0;
        return {
          symbol: p.symbol,
          name: p.symbol,
          weight: totalValue > 0 ? Math.round((val / totalValue) * 100) : 0,
          value: `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
          change: `${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(1)}%`,
          up: pnlPct >= 0,
          color: SYMBOL_COLORS[p.symbol] || 'bg-gray-500',
        };
      })
    : MOCK_ASSETS;

  return (
    <div className="h-full bg-[#050505] p-4 md:p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500 mb-2 block">Total Portfolio Value</span>
                {hasLivePositions && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold mb-2">LIVE</span>}
              </div>
              <h2 className="text-5xl font-black text-white font-mono mb-4 tracking-tighter">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${totalPnl >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                  {totalPnl >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>${Math.abs(totalPnl).toLocaleString(undefined, { minimumFractionDigits: 2 })} ({totalValue > 0 ? (totalPnl / totalValue * 100).toFixed(1) : '0'}%)</span>
                </div>
              </div>
            </div>
            <div className="mt-12 h-24 flex items-end gap-1 overflow-hidden opacity-50">
              {(convexEquity && convexEquity.length > 0
                ? convexEquity.slice().reverse().map((e, i) => {
                    const maxEq = Math.max(...convexEquity.map(x => x.totalEquity));
                    return <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm" style={{ height: `${maxEq > 0 ? (e.totalEquity / maxEq) * 100 : 50}%` }} />;
                  })
                : [...Array(20)].map((_, i) => (
                    <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm" style={{ height: `${20 + Math.random() * 80}%` }} />
                  ))
              )}
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Account Metrics</h3>
            <div className="space-y-4">
              {[
                { icon: Activity, color: 'text-blue-400', label: 'Sharpe Ratio', val: '3.24', valColor: '' },
                { icon: DollarSign, color: 'text-emerald-400', label: 'Max Drawdown', val: '-2.1%', valColor: 'text-red-400' },
                { icon: Layers, color: 'text-purple-400', label: 'Active Alpha', val: '+1.2%', valColor: 'text-emerald-400' },
              ].map(({ icon: Icon, color, label, val, valColor }) => (
                <div key={label} className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-3"><Icon className={`w-5 h-5 ${color}`} /><span className="text-xs font-bold">{label}</span></div>
                  <span className={`font-mono font-bold ${valColor}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <h3 className="text-lg font-bold text-white px-2">Asset Allocation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {assets.map((asset) => (
              <div key={asset.symbol} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-10 h-10 rounded-xl ${asset.color} bg-opacity-10 flex items-center justify-center font-bold text-lg`}>{asset.symbol[0]}</div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${asset.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {asset.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{asset.change}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white/40 mb-1">{asset.name}</h4>
                  <p className="text-xl font-bold font-mono text-white">{asset.value}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/20">{asset.weight}% Weight</span>
                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${asset.color}`} style={{ width: `${asset.weight}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioView;
