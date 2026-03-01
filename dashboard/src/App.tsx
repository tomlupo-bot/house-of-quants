import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatOverlay from './components/ChatOverlay';
import AgentList from './components/AgentList';
import FeedView from './components/FeedView';
import TasksView from './components/TasksView';
import PortfolioView from './components/PortfolioView';
import Treasury from './components/Treasury';
import Footer from './components/Footer';
import WelcomeOverlay from './components/WelcomeOverlay';
import { TradeEvent, Task, TabId } from './types';
import { INITIAL_TASKS, generateRandomEvent, INITIAL_AGENTS } from './constants';
import { useSignals } from './hooks/useHoQ';

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mockEvents, setMockEvents] = useState<TradeEvent[]>([]);
  const [tasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<TabId>('agents');

  const convexSignals = useSignals();

  // Map Convex signals to TradeEvent format for the feed
  const events: TradeEvent[] = convexSignals && convexSignals.length > 0
    ? convexSignals.map(s => ({
        id: s._id,
        agentId: s.agentId,
        agentName: s.agentId,
        agentEmoji: '📡',
        type: s.type as any,
        message: s.message,
        timestamp: s.timestamp,
        severity: s.severity as any,
      }))
    : mockEvents;

  useEffect(() => {
    // Only generate mock events if no Convex signals
    if (convexSignals && convexSignals.length > 0) return;
    const interval = setInterval(() => {
      const newEvent = generateRandomEvent(INITIAL_AGENTS);
      setMockEvents(prev => [newEvent, ...prev].slice(0, 100));
    }, 3000);
    return () => clearInterval(interval);
  }, [convexSignals]);

  const renderContent = () => {
    switch (activeTab) {
      case 'feed': return <FeedView events={events} />;
      case 'tasks': return <TasksView tasks={tasks} />;
      case 'agents': return <AgentList />;
      case 'portfolio': return <PortfolioView />;
      case 'treasury': return <Treasury />;
      default: return <AgentList />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-hidden">
      {showWelcome && <WelcomeOverlay onDismiss={() => setShowWelcome(false)} />}
      <Header
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        eventCount={events.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0">{renderContent()}</div>
        {isChatOpen && <ChatOverlay onClose={() => setIsChatOpen(false)} />}
      </main>
      <Footer />
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,1)] z-[5]" />
    </div>
  );
};

export default App;
