export type AgentStatus = 'analyzing' | 'idle' | 'warning' | 'profitable';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  emoji: string;
  lastThought: string;
  x: number;
  y: number;
  color: string;
}

export interface TradeEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  type: 'SCRAPE' | 'SIGNAL' | 'TRADE' | 'RISK' | 'OPTIMIZE' | 'PREDICT' | 'RESEARCH';
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export interface Task {
  id: string;
  name: string;
  progress: number;
  status: 'active' | 'completed' | 'pending';
  steps: string[];
}

export type TabId = 'feed' | 'tasks' | 'agents' | 'portfolio' | 'treasury';
