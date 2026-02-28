# 🏛️ House of Quants — Comprehensive Plan

> One team of specialized AI agents sharing a capital pool, collaborating across crypto trading, prediction markets, and research publication.

---

## 1. Vision

### What it is
A **collaborative AI trading team** visualized as a live "trading floor" dashboard. Unlike CryptoArena (where models compete), House of Quants agents **specialize and cooperate** — each with a distinct role, sharing one P&L, one budget, one goal: maximize risk-adjusted returns.

### What makes it unique
- **Multi-engine revenue:** Crypto + Polymarket + Research (not just trading)
- **Token costs = real capital drag:** Every LLM call deducts from the shared budget, forcing efficiency
- **Visible reasoning:** Every agent's thoughts, decisions, and data flows are visible on the dashboard
- **Collaborative architecture:** Agents feed each other (Data Ghost → Quantum Seer → Blitz Bot), not isolated
- **Content output:** The team publishes research, making the process educational and shareable

### Success metrics
- Risk-adjusted return (Sharpe ratio) across all engines
- Token efficiency: return per dollar spent on LLM calls
- Content quality: engagement with published research
- Survival: how long the team operates before budget depletion

---

## 2. Agent Roster

### 2.1 Data Ghost 🕵️ — Market Intelligence
**Role:** Scrapes and aggregates market data. Never trades. Feeds all other agents.

**Inputs:**
- Crypto orderbooks, OHLCV, funding rates (via MCP price server)
- On-chain metrics (whale movements, exchange flows)
- Social sentiment (Twitter/X bookmarks, Reddit, CT)
- News headlines and macro events
- Polymarket event data and odds

**Outputs:**
- Structured market briefs (JSON) consumed by other agents
- Anomaly alerts (unusual volume, sentiment shifts, whale movements)
- Data freshness timestamps (other agents know how stale their info is)

**Model:** Cheapest available (Gemini Flash / DeepSeek) — high volume, low cost
**Token budget:** ~30% of total LLM spend (highest volume, lowest per-call cost)

---

### 2.2 Quantum Seer 📈 — Signal Generator
**Role:** Analyzes Data Ghost's feeds and generates trade/bet signals with confidence scores.

**Inputs:**
- Market briefs from Data Ghost
- Technical indicators (via MCP indicators server)
- Historical pattern matches
- Cross-engine correlation data from Peak Alpha

**Outputs:**
- Trade signals: `{asset, direction, confidence, timeframe, rationale}`
- Polymarket signals: `{event, position, edge_estimate, rationale}`
- Signal quality tracking (hit rate, avg return per signal)

**Decision framework:**
- Confidence ≥ 70% → pass to Guardian for risk check
- Confidence 50-70% → flag as "watching", revisit next cycle
- Confidence < 50% → discard, log reasoning

**Model:** Mid-tier (Gemini Pro / DeepSeek) — needs reasoning but not premium
**Token budget:** ~25% of total LLM spend

---

### 2.3 The Guardian 🛡️ — Risk Manager
**Role:** Approves or vetoes all trades/bets. Monitors portfolio risk. Has absolute veto power.

**Inputs:**
- Proposed trades from Blitz Bot
- Proposed bets from Oracle
- Current portfolio state (positions, exposure, correlation)
- Market volatility regime

**Outputs:**
- Approve/reject decisions with reasoning
- Position sizing recommendations
- Portfolio-level risk metrics: VaR, max drawdown, correlation matrix
- Emergency stop signals (halt all trading)

**Risk rules (hardcoded, not LLM-dependent):**
- Max single position: 15% of portfolio
- Max total exposure: 80% (20% always in cash)
- Max drawdown trigger: -20% → reduce all positions by 50%
- Max correlation: no two positions with r > 0.8
- Daily loss limit: -5% → halt trading for 24h
- Token cost circuit breaker: if cumulative token cost > 10% of starting capital → alert

**Model:** Premium (Claude Sonnet) — risk decisions need best reasoning
**Token budget:** ~10% of total LLM spend (few calls, high stakes)

---

### 2.4 Blitz Bot 🚀 — Crypto Execution
**Role:** Executes crypto trades approved by Guardian. Manages entries, exits, and order types.

**Inputs:**
- Approved signals from Quantum Seer (post-Guardian)
- Current positions and P&L
- Market microstructure data (spread, depth, slippage estimate)

**Outputs:**
- Executed trades with fill details
- Position updates
- Slippage reports
- Exit signals (take-profit, stop-loss, trailing stop)

**Execution rules:**
- Market orders for urgent signals, limit orders for non-urgent
- Split large orders into chunks (reduce slippage)
- Automatic stop-loss at Guardian's recommended level
- Trail stops after +5% profit

**Markets:** BTC, ETH, SOL, LINK, AVAX, DOGE, ARB, OP, MATIC, DOT (top 10 by liquidity)
**Model:** Cheapest (Flash) — execution is mechanical, not analytical
**Token budget:** ~5% of total LLM spend

---

### 2.5 Oracle 🎲 — Prediction Markets
**Role:** Finds and trades mispriced events on Polymarket.

**Inputs:**
- Event data from Data Ghost (odds, volume, resolution criteria)
- Own probability models (base rates, reference classes)
- News and context for event assessment
- Guardian's risk limits for bet sizing

**Outputs:**
- Bet decisions: `{event, side, size, estimated_edge, confidence}`
- Position tracking (open bets, P&L, resolution dates)
- Probability updates as new info arrives
- Edge decay tracking (is our edge shrinking?)

**Strategy:**
- Focus on events where market odds differ from model by ≥ 10%
- Prefer events resolving within 30 days (faster capital turnover)
- Max single bet: 5% of portfolio
- Kelly criterion for sizing (half-Kelly for safety)

**Model:** Mid-tier (Gemini Pro) — needs reasoning for probability assessment
**Token budget:** ~15% of total LLM spend

---

### 2.6 Peak Alpha 🧠 — Portfolio Optimizer (Orchestrator)
**Role:** Decides capital allocation across engines. Rebalances based on performance. The team's "CEO."

**Inputs:**
- Performance metrics from all engines (returns, Sharpe, win rate)
- Token cost data per agent
- Market regime assessment
- Risk metrics from Guardian

**Outputs:**
- Capital allocation: `{crypto: X%, polymarket: Y%, cash: Z%}`
- Agent activation/deactivation decisions
- Rebalancing orders
- Weekly strategy memos

**Allocation rules:**
- Minimum 10% cash reserve (untouchable)
- Rebalance weekly or on >5% drawdown
- Scale down underperforming engines, scale up outperformers
- If total portfolio down >15%, shift to 50% cash

**Model:** Premium (Claude Sonnet) — strategic decisions
**Token budget:** ~5% of total LLM spend

---

### 2.7 The Scribe ✍️ — Research & Content
**Role:** Publishes market analysis, trade rationales, and weekly reports. The team's public voice.

**Inputs:**
- All trade decisions and rationales from other agents
- Market data and context from Data Ghost
- Performance data from Peak Alpha
- Interesting patterns from Quantum Seer

**Outputs:**
- Daily market brief (posted to Discord #house-of-quants)
- Trade rationale threads (when significant positions open/close)
- Weekly performance report with analysis
- Monthly deep-dive research pieces
- "Agent thoughts" — curated interesting reasoning from the team

**Content guidelines:**
- Data-driven, not hype
- Show the reasoning, not just conclusions
- Acknowledge uncertainty and risks
- Include performance attribution (what worked, what didn't, why)

**Model:** Mid-tier (Gemini Pro / DeepSeek) — good writing, not premium cost
**Token budget:** ~10% of total LLM spend

---

## 3. Economic Model

### 3.1 Capital Structure
```
Starting Capital: $10,000 (virtual USDT)

Revenue streams:
  ├── Crypto P&L (Blitz Bot)
  ├── Polymarket P&L (Oracle)  
  └── Content value (Scribe) → measured by engagement metrics

Costs:
  ├── Token costs (all agents) → deducted from capital
  ├── Trading fees (simulated: 0.1% per trade)
  └── Polymarket fees (simulated: 2% on winnings)
```

### 3.2 Token Budget Allocation
```
Total monthly budget estimate: ~$5-15 (at current rates)

Data Ghost:    30% │████████████░░░░░░░░│ High volume, cheap model
Quantum Seer:  25% │██████████░░░░░░░░░░│ Analysis calls
Oracle:        15% │██████░░░░░░░░░░░░░░│ Probability modeling  
Guardian:      10% │████░░░░░░░░░░░░░░░░│ Few calls, premium model
Scribe:        10% │████░░░░░░░░░░░░░░░░│ Content generation
Peak Alpha:     5% │██░░░░░░░░░░░░░░░░░░│ Weekly strategic calls
Blitz Bot:      5% │██░░░░░░░░░░░░░░░░░░│ Mechanical execution
```

### 3.3 Survival Tiers
```
Equity > 120% start  →  🟢 Thriving (expand operations)
Equity 100-120%      →  🔵 Stable (maintain)
Equity 80-100%       →  🟡 Struggling (reduce token spend)
Equity 60-80%        →  🔴 Critical (minimal operations, cash preservation)
Equity < 60%         →  💀 Dead (shutdown, post-mortem)
```

---

## 4. Data Architecture

### 4.1 Convex Schema (shared with Mission Control on giant-eel-625)

```
hoq_teams          — Team config and current state
hoq_agents         — Agent roster, status, current thought, last action
hoq_capital        — Capital pool state, allocation, balances
hoq_signals        — Signal queue (Seer → Guardian → Executor)
hoq_positions      — Open positions (crypto + polymarket)
hoq_trades         — Trade history
hoq_bets           — Polymarket bet history
hoq_equity         — Equity curve snapshots (time series)
hoq_content        — Published research and analysis
hoq_agent_thoughts — Live agent reasoning log (for dashboard)
hoq_experiments    — Experiment configs and lifecycle
hoq_token_costs    — Per-agent token cost tracking
```

### 4.2 Data Flow
```
┌──────────────────────────────────────────────────────┐
│                    CONVEX (real-time)                  │
│                                                        │
│  Market Data ──→ Data Ghost ──→ hoq_agent_thoughts    │
│                       │                                │
│                       ▼                                │
│               Quantum Seer ──→ hoq_signals            │
│                       │                                │
│                       ▼                                │
│                 Guardian ──→ approve/reject             │
│                    │    │                               │
│                    ▼    ▼                               │
│              Blitz Bot  Oracle ──→ hoq_trades/bets     │
│                    │    │                               │
│                    ▼    ▼                               │
│               hoq_positions ──→ hoq_equity             │
│                       │                                │
│                       ▼                                │
│               Peak Alpha ──→ hoq_capital (rebalance)   │
│                       │                                │
│                       ▼                                │
│                 Scribe ──→ hoq_content → Discord       │
└──────────────────────────────────────────────────────┘
```

---

## 5. Dashboard Design

### 5.1 Pages

#### 🏛️ Trading Floor (home)
- Animated agent avatars on a dark grid (from Gemini app concept)
- Agents move subtly, speech bubbles show live thoughts
- SVG data flow lines between agents (who's feeding whom)
- Color-coded status: analyzing (blue), profitable (green), warning (amber), idle (gray)
- Click agent → expanded card with recent decisions, token cost, performance

#### 💰 Treasury
- Total capital pool with real-time value
- Allocation pie chart: crypto / polymarket / cash / token costs
- Burn rate: tokens spent per day, projected runway
- Revenue breakdown by engine
- Historical capital flow

#### 📈 Performance
- Combined equity curve (all engines)
- Per-engine equity curves (overlay toggle)
- Key metrics: Sharpe, Sortino, max drawdown, win rate, profit factor
- Token efficiency: return per $1 of LLM cost
- Benchmark comparison (vs buy-and-hold BTC)

#### 🔮 Positions
- Active crypto positions with live P&L
- Open Polymarket bets with current odds and edge estimate
- Position heat map (exposure by asset/sector)
- Pending signals (awaiting Guardian approval)

#### 📰 Research Feed
- Scribe's published analysis (newest first)
- Trade rationale cards (why each position was opened/closed)
- Weekly reports
- Agent "interesting thoughts" highlights

#### 🎮 Control Panel
- Start/stop experiment
- Capital allocation sliders
- Agent enable/disable toggles
- Model selection per agent
- Date range for historical sim
- Token budget limits

### 5.2 Visual Design
- **Theme:** Ultra-dark (#050505 bg), emerald (#10b981) accent
- **Typography:** Mono for numbers, clean sans for text
- **Animations:** Subtle — agent movement, data flow pulses, number ticking
- **Mobile:** Fully responsive (agents stack vertically on mobile)
- **Welcome overlay:** "Initialize Session" splash (from Gemini app)

---

## 6. Technical Architecture

### 6.1 Stack
```
Frontend:     Vite + React + Tailwind + Recharts + Lucide icons
Backend:      Convex (real-time subscriptions)
LLM:          OpenRouter (multi-model routing)
Data:         MCP tool servers (price, indicators, portfolio, math)
Polymarket:   Internal API skill (already captured)
Deploy:       Vercel (auto on push to main)
Orchestrator: Python (VPS-side, runs agent loop)
Discord:      Control panel + Scribe publications
```

### 6.2 Agent Runtime
```python
# Simplified agent loop (runs on VPS)
class HouseOfQuants:
    def __init__(self, config):
        self.capital = CapitalPool(config.initial_cash)
        self.agents = {
            'data_ghost': DataGhostAgent(model='gemini-3-flash'),
            'quantum_seer': QuantumSeerAgent(model='gemini-3.1-pro'),
            'guardian': GuardianAgent(model='claude-sonnet-4.5'),
            'blitz_bot': BlitzBotAgent(model='gemini-3-flash'),
            'oracle': OracleAgent(model='gemini-3.1-pro'),
            'peak_alpha': PeakAlphaAgent(model='claude-sonnet-4.5'),
            'scribe': ScribeAgent(model='deepseek-v3.2'),
        }
    
    def run_cycle(self, timestamp):
        # 1. Data collection
        market_brief = self.agents['data_ghost'].gather(timestamp)
        
        # 2. Signal generation
        signals = self.agents['quantum_seer'].analyze(market_brief)
        
        # 3. Risk assessment
        approved = []
        for signal in signals:
            decision = self.agents['guardian'].assess(signal, self.capital)
            if decision.approved:
                approved.append((signal, decision.position_size))
        
        # 4. Execution
        for signal, size in approved:
            if signal.engine == 'crypto':
                self.agents['blitz_bot'].execute(signal, size)
            elif signal.engine == 'polymarket':
                self.agents['oracle'].execute(signal, size)
        
        # 5. Portfolio check (weekly)
        if is_rebalance_day(timestamp):
            self.agents['peak_alpha'].rebalance(self.capital)
        
        # 6. Content (daily)
        self.agents['scribe'].publish_daily_brief(market_brief, approved)
        
        # 7. Sync to Convex
        self.sync_to_convex()
```

### 6.3 MCP Tool Servers (reused from CryptoArena)
```
Port 8000: math         — calculations, statistics
Port 8003: price        — crypto OHLCV, live prices
Port 8005: crypto_trade — simulated trade execution
Port 8006: indicators   — RSI, MACD, Bollinger, etc.
Port 8007: portfolio    — position management, P&L
Port 8008: polymarket   — event data, bet execution (NEW)
```

### 6.4 Convex Integration
- **Mutations:** called by VPS orchestrator to push agent state, trades, signals
- **Queries:** consumed by React dashboard for real-time display
- **HTTP actions:** exposed for VPS to call (experiment lifecycle)
- **Subscriptions:** dashboard auto-updates via Convex reactive queries

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Week 1) ✦ MVP
**Goal:** Dashboard with trading floor visualization + basic agent loop

- [ ] Set up repo (Vite + React + Tailwind + Convex)
- [ ] Design Convex schema (hoq_* tables)
- [ ] Build Trading Floor page (animated agents, speech bubbles)
- [ ] Build Treasury page (capital pool, allocation)
- [ ] Build Control Panel (start/stop, basic config)
- [ ] Port agent runtime from CryptoArena (single-loop, sequential)
- [ ] Wire Data Ghost + Quantum Seer + Blitz Bot (crypto only)
- [ ] Guardian with hardcoded rules (no LLM yet)
- [ ] Basic Convex sync (equity, trades, agent thoughts)
- [ ] Deploy to Vercel
- [ ] Discord control panel (start/stop buttons)

**Deliverable:** Working dashboard showing agents trading crypto with live data

### Phase 2: Multi-Engine (Week 2-3)
**Goal:** Add Polymarket + research output

- [ ] Oracle agent + Polymarket integration (using existing skill)
- [ ] MCP polymarket server (bet execution, event data)
- [ ] Scribe agent + Discord publication
- [ ] Peak Alpha orchestrator (capital allocation logic)
- [ ] Guardian LLM upgrade (contextual risk assessment)
- [ ] Performance page (equity curves, Sharpe, etc.)
- [ ] Positions page (crypto + polymarket combined view)
- [ ] Research Feed page
- [ ] Token cost tracking per agent
- [ ] Survival tier system

**Deliverable:** Full multi-engine team with live dashboard

### Phase 3: Polish & Scale (Week 4+)
**Goal:** Production quality, content strategy

- [ ] Agent personality tuning (distinct voices in reasoning)
- [ ] Advanced visualizations (data flow animations, trade replay)
- [ ] Mobile optimization
- [ ] Weekly automated reports (Scribe → Discord + dashboard)
- [ ] Backtesting mode (replay historical data)
- [ ] Multi-experiment comparison
- [ ] Public read-only dashboard mode (shareable link)
- [ ] Content RSS/newsletter integration
- [ ] Performance benchmarking vs indices

---

## 8. Key Decisions to Make

| Decision | Options | Recommendation |
|----------|---------|----------------|
| **Simulation vs paper trading** | Pure simulation (historical data) vs live paper trading (real-time prices) | Start with simulation (controlled), add live paper later |
| **Agent communication** | Direct function calls vs message queue vs Convex as bus | Convex as message bus (signals table) — observable, persistent |
| **Trading cycle frequency** | Hourly / 4h / daily | Daily for crypto, continuous for Polymarket |
| **Polymarket execution** | Simulated vs real (small amounts) | Simulated first, real after proven edge |
| **Content publication** | Discord only vs Discord + web vs Discord + newsletter | Discord + web dashboard Research Feed |
| **Separate Convex project** | New project vs share giant-eel-625 | Share with `hoq_` prefix (same as CryptoArena approach) |

---

## 9. Migration from CryptoArena

### What we keep:
- MCP tool servers (price, indicators, portfolio, math, crypto_trade)
- TrackedLLMProvider (token cost tracking via OpenRouter)
- EconomicTracker (deduct costs from capital)
- Convex deployment (giant-eel-625)
- Vercel deployment pipeline
- Discord integration pattern

### What changes:
- **Architecture:** Competition → Collaboration
- **Agents:** Generic traders → Specialized roles
- **Data flow:** Independent → Pipeline (feed chain)
- **Dashboard:** Leaderboard focus → Trading floor + treasury + research
- **Output:** Just trades → Trades + bets + research content
- **Schema:** arena_* tables → hoq_* tables

### What's new:
- Polymarket engine
- Content/research publication
- Inter-agent communication protocol
- Capital allocation optimizer
- Guardian veto system
- Multi-engine P&L tracking

---

## 10. File Structure

```
house-of-quants/
├── README.md
├── docs/
│   ├── PLAN.md                    # This document
│   ├── AGENTS.md                  # Detailed agent specifications
│   ├── SCHEMA.md                  # Convex schema reference
│   └── DECISIONS.md               # Architecture decision log
├── dashboard/                     # Frontend (Vite + React)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── TradingFloor.tsx   # Animated agent visualization
│   │   │   ├── AgentCard.tsx      # Individual agent display
│   │   │   ├── Treasury.tsx       # Capital pool dashboard
│   │   │   ├── Performance.tsx    # Equity curves, metrics
│   │   │   ├── Positions.tsx      # Open trades + bets
│   │   │   ├── ResearchFeed.tsx   # Published content
│   │   │   ├── ControlPanel.tsx   # Experiment management
│   │   │   └── Header.tsx
│   │   ├── hooks/
│   │   │   └── useHoQ.ts         # Convex query hooks
│   │   └── types.ts
│   ├── convex/
│   │   ├── schema.ts
│   │   ├── hoq.ts                # Queries + mutations
│   │   └── http.ts               # HTTP actions for VPS
│   └── package.json
├── engine/                        # Python agent runtime
│   ├── orchestrator.py           # Main loop
│   ├── capital_pool.py           # Shared capital management
│   ├── agents/
│   │   ├── base.py               # BaseAgent class
│   │   ├── data_ghost.py
│   │   ├── quantum_seer.py
│   │   ├── guardian.py
│   │   ├── blitz_bot.py
│   │   ├── oracle.py
│   │   ├── peak_alpha.py
│   │   └── scribe.py
│   ├── engines/
│   │   ├── crypto.py             # Crypto trading engine
│   │   └── polymarket.py         # Polymarket engine
│   └── utils/
│       ├── llm_provider.py       # TrackedLLMProvider
│       ├── convex_sync.py        # Push data to Convex
│       └── mcp_client.py         # MCP tool client
├── configs/
│   ├── default.json              # Default experiment config
│   └── agents.json               # Agent model assignments
├── scripts/
│   ├── start_services.sh         # MCP server startup
│   ├── poller.py                 # Watch Convex for experiments
│   └── sync_to_convex.py         # Result sync
└── data/
    ├── crypto/                   # Price data
    └── polymarket/               # Event data cache
```

---

*Last updated: 2026-02-28*
*Author: Quark 🤖 + Tom*
