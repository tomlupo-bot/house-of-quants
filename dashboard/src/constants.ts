import { Agent, Task, TradeEvent, AgentStatus } from './types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'scraper-1',
    name: 'Data Ghost',
    role: 'Market Scraper',
    status: 'analyzing',
    emoji: '🕵️',
    lastThought: 'Scraping Binance order books for BTC...',
    x: 12, y: 25,
    color: '#3b82f6',
  },
  {
    id: 'analyzer-1',
    name: 'Quantum Seer',
    role: 'Signal Generator',
    status: 'profitable',
    emoji: '📈',
    lastThought: 'RSI divergence detected on ETH/USDT 5m.',
    x: 38, y: 30,
    color: '#10b981',
  },
  {
    id: 'risk-1',
    name: 'The Guardian',
    role: 'Risk Assessor',
    status: 'idle',
    emoji: '🛡️',
    lastThought: 'Portfolio VaR remains within 2% threshold.',
    x: 62, y: 22,
    color: '#f59e0b',
  },
  {
    id: 'executor-1',
    name: 'Blitz Bot',
    role: 'Trade Executor',
    status: 'idle',
    emoji: '🚀',
    lastThought: 'Waiting for confirmed buy signal...',
    x: 85, y: 35,
    color: '#ef4444',
  },
  {
    id: 'optimizer-1',
    name: 'Peak Alpha',
    role: 'Portfolio Optimizer',
    status: 'analyzing',
    emoji: '🧠',
    lastThought: 'Adjusting weights for volatility spike.',
    x: 25, y: 70,
    color: '#8b5cf6',
  },
  {
    id: 'oracle-1',
    name: 'Oracle',
    role: 'Prediction Markets',
    status: 'profitable',
    emoji: '🎲',
    lastThought: 'Polymarket: 72% chance of rate cut priced in.',
    x: 55, y: 72,
    color: '#ec4899',
  },
  {
    id: 'scribe-1',
    name: 'Scribe',
    role: 'Research & Content',
    status: 'analyzing',
    emoji: '✍️',
    lastThought: 'Drafting weekly alpha report from signal data.',
    x: 78, y: 68,
    color: '#06b6d4',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    name: 'Volatility Arbitrage Scan',
    progress: 78,
    status: 'active' as const,
    steps: ['Fetch Data', 'Calc IV', 'Find Spreads', 'Execute'],
  },
  {
    id: 't2',
    name: 'Black Swan Simulation',
    progress: 100,
    status: 'completed' as const,
    steps: ['Define Scenarios', 'Run Monte Carlo', 'Report Risk'],
  },
  {
    id: 't3',
    name: 'Prediction Market Arbitrage',
    progress: 42,
    status: 'active' as const,
    steps: ['Scan Markets', 'Identify Mispricing', 'Size Position', 'Execute'],
  },
];

const MESSAGES = [
  "Pulled Binance data for ETH.",
  "Spotting a pattern in BTC... Buy signal at $98k?",
  "VaR threshold check passed.",
  "Rebalancing to 60% crypto... Done!",
  "Fine-tuned model—+5% accuracy in sims.",
  "Audited trade—All clear.",
  "Market sentiment shift detected in social feeds.",
  "Executing paper trade: BUY 0.5 BTC.",
  "Liquidity levels normal across all exchanges.",
  "Adjusting leverage for increased volatility.",
  "Polymarket spread opportunity: 3.2% edge detected.",
  "Weekly alpha report drafted and queued for review.",
];

const TYPES: TradeEvent['type'][] = ['SCRAPE', 'SIGNAL', 'TRADE', 'RISK', 'OPTIMIZE', 'PREDICT', 'RESEARCH'];
const SEVERITIES: TradeEvent['severity'][] = ['info', 'success', 'warning', 'error'];

export const generateRandomEvent = (agents: Agent[]): TradeEvent => {
  const agent = agents[Math.floor(Math.random() * agents.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toLocaleTimeString(),
    agentId: agent.id,
    agentName: agent.name,
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
    severity: Math.random() > 0.8 ? SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)] : 'info',
  };
};

export const getRandomStatus = (): AgentStatus => {
  const statuses: AgentStatus[] = ['analyzing', 'idle', 'profitable', 'warning'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};
