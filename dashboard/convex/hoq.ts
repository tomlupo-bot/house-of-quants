import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ===== Queries =====

export const getAgents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hoq_agents").collect();
  },
});

export const getSignals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hoq_signals").withIndex("by_timestamp").order("desc").take(100);
  },
});

export const getCapital = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hoq_capital").collect();
  },
});

export const getPositions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hoq_positions").collect();
  },
});

export const getTrades = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hoq_trades").withIndex("by_executedAt").order("desc").take(50);
  },
});

export const getEquity = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hoq_equity").withIndex("by_timestamp").order("desc").take(30);
  },
});

export const getThoughts = query({
  args: { agentId: v.optional(v.string()) },
  handler: async (ctx, { agentId }) => {
    if (agentId) {
      return await ctx.db.query("hoq_agent_thoughts").withIndex("by_agentId", (q) => q.eq("agentId", agentId)).collect();
    }
    return await ctx.db.query("hoq_agent_thoughts").collect();
  },
});

export const getContent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hoq_content").order("desc").take(20);
  },
});

export const getTokenCosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hoq_token_costs").order("desc").take(100);
  },
});

// ===== Mutations =====

export const upsertAgent = mutation({
  args: {
    agentId: v.string(),
    name: v.string(),
    role: v.string(),
    emoji: v.string(),
    status: v.string(),
    lastThought: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("hoq_agents").withIndex("by_agentId", (q) => q.eq("agentId", args.agentId)).first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("hoq_agents", { ...args, lastActive: Date.now() });
    }
  },
});

export const addSignal = mutation({
  args: {
    agentId: v.string(),
    type: v.string(),
    message: v.string(),
    severity: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("hoq_signals", { ...args, timestamp: Date.now() });
  },
});

export const addTrade = mutation({
  args: {
    symbol: v.string(),
    side: v.string(),
    size: v.float64(),
    price: v.float64(),
    fee: v.optional(v.float64()),
    agentId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("hoq_trades", { ...args, executedAt: Date.now() });
  },
});

export const updateCapital = mutation({
  args: {
    pool: v.string(),
    amount: v.float64(),
    currency: v.string(),
    allocatedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("hoq_capital").filter(q => q.eq(q.field("pool"), args.pool)).first();
    if (existing) {
      await ctx.db.patch(existing._id, { amount: args.amount, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("hoq_capital", { ...args, updatedAt: Date.now() });
    }
  },
});

export const addEquitySnapshot = mutation({
  args: {
    totalEquity: v.float64(),
    dailyPnl: v.float64(),
    drawdown: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("hoq_equity", { ...args, timestamp: Date.now() });
  },
});

export const addTokenCost = mutation({
  args: {
    agentId: v.string(),
    model: v.string(),
    inputTokens: v.float64(),
    outputTokens: v.float64(),
    cost: v.float64(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("hoq_token_costs", { ...args, timestamp: Date.now() });
  },
});

export const addThought = mutation({
  args: {
    agentId: v.string(),
    thought: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("hoq_agent_thoughts", { ...args, timestamp: Date.now() });
  },
});

export const upsertPosition = mutation({
  args: {
    symbol: v.string(),
    side: v.string(),
    size: v.float64(),
    entryPrice: v.float64(),
    currentPrice: v.optional(v.float64()),
    pnl: v.optional(v.float64()),
    agentId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("hoq_positions").withIndex("by_symbol", q => q.eq("symbol", args.symbol)).first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, openedAt: existing.openedAt });
    } else {
      await ctx.db.insert("hoq_positions", { ...args, openedAt: Date.now() });
    }
  },
});

export const addContent = mutation({
  args: {
    agentId: v.string(),
    type: v.string(),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("hoq_content", { ...args, createdAt: Date.now() });
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const agents = [
      { agentId: 'scraper-1', name: 'Data Ghost', role: 'Market Scraper', emoji: '🕵️', status: 'analyzing', lastThought: 'Scraping Binance order books...', color: '#3b82f6' },
      { agentId: 'analyzer-1', name: 'Quantum Seer', role: 'Signal Generator', emoji: '📈', status: 'profitable', lastThought: 'RSI divergence on ETH/USDT 5m.', color: '#10b981' },
      { agentId: 'risk-1', name: 'The Guardian', role: 'Risk Assessor', emoji: '🛡️', status: 'idle', lastThought: 'VaR within 2% threshold.', color: '#f59e0b' },
      { agentId: 'executor-1', name: 'Blitz Bot', role: 'Trade Executor', emoji: '🚀', status: 'idle', lastThought: 'Waiting for buy signal...', color: '#ef4444' },
      { agentId: 'optimizer-1', name: 'Peak Alpha', role: 'Portfolio Optimizer', emoji: '🧠', status: 'analyzing', lastThought: 'Adjusting weights for vol spike.', color: '#8b5cf6' },
      { agentId: 'oracle-1', name: 'Oracle', role: 'Prediction Markets', emoji: '🎲', status: 'profitable', lastThought: 'Polymarket: 72% rate cut priced in.', color: '#ec4899' },
      { agentId: 'scribe-1', name: 'Scribe', role: 'Research & Content', emoji: '✍️', status: 'analyzing', lastThought: 'Drafting weekly alpha report.', color: '#06b6d4' },
    ];
    for (const a of agents) {
      const existing = await ctx.db.query("hoq_agents").withIndex("by_agentId", (q) => q.eq("agentId", a.agentId)).first();
      if (!existing) await ctx.db.insert("hoq_agents", { ...a, lastActive: Date.now() });
    }
  },
});
