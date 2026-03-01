import React from 'react';

const WelcomeOverlay: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 animate-fade-in">
    <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-10 text-center shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #10b981 0%, transparent 70%)' }}
      />
      <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] relative z-10">
        <div className="w-10 h-10 border-4 border-black rounded-full border-t-transparent animate-spin" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">HOUSE OF QUANTS</h2>
      <p className="text-sm text-white/50 mb-10 leading-relaxed font-light">
        Access the autonomous trading floor. Monitoring 7 quantum agents across Global Liquidity Markets.
      </p>
      <button
        onClick={onDismiss}
        className="w-full py-4 bg-emerald-500 text-black font-extrabold uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
      >
        Initialize Session
      </button>
      <div className="mt-8 text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">
        Status: Verified • Secure Link Active
      </div>
    </div>
  </div>
);

export default WelcomeOverlay;
