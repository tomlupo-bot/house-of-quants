import React from 'react';
import { Task } from '../types';
import { CheckCircle2, CircleDashed, Clock } from 'lucide-react';

const TasksView: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
  <div className="h-full bg-[#050505] p-4 md:p-8 overflow-y-auto custom-scrollbar">
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Active Missions</h2>
        <p className="text-white/40 text-sm">Strategic workflows currently being executed by the agent swarm.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col hover:border-emerald-500/30 transition-all group relative overflow-hidden">
            {task.status === 'completed' && <div className="absolute top-4 right-4 text-emerald-500"><CheckCircle2 className="w-6 h-6" /></div>}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{task.name}</h3>
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase text-white/30 tracking-widest">
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 14m Elapsed</span>
                <span className="px-2 py-0.5 bg-white/5 rounded border border-white/5">{task.status}</span>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-white/60">Execution Progress</span>
                <span className="text-emerald-400 font-mono">{task.progress}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${task.progress}%` }} />
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-4">Pipeline Steps</p>
              {task.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${idx < (task.progress / 25) ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/10'}`} />
                  <span className={`text-xs ${idx < (task.progress / 25) ? 'text-white font-medium' : 'text-white/20'}`}>{step}</span>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Inspect Metadata</button>
          </div>
        ))}
        <div className="border-2 border-dashed border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-white/10 transition-all">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CircleDashed className="w-6 h-6 text-white/20" />
          </div>
          <h4 className="text-sm font-bold text-white/40">Queue New Mission</h4>
          <p className="text-[10px] text-white/20 mt-1 uppercase tracking-tighter">Strategist approval required</p>
        </div>
      </div>
    </div>
  </div>
);

export default TasksView;
