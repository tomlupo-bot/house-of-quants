import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  hoq_agents: defineTable({
    agentId: v.string(),
    name: v.string(),
    role: v.string(),
    emoji: v.string(),
    status: v.string(),
    lastThought: v.string(),
    color: v.string(),
    efficiency: v.optional(v.float64()),
    latency: v.optional(v.float64()),
    lastActive: v.optional(v.float64()),
  }).index("by_agentId", ["agentId"]),

  hoq_capital: defineTable({
    pool: v.string(),
    amount: v.float64(),
    currency: v.string(),
    allocatedTo: v.optional(v.string()),
    updatedAt: v.float64(),
  }),

  hoq_signals: defineTable({
    agentId: v.string(),
    type: v.string(),
    message: v.string(),
    severity: v.string(),
    timestamp: v.float64(),
  }).index("by_timestamp", ["timestamp"]),

  hoq_positions: defineTable({
    symbol: v.string(),
    side: v.string(),
    size: v.float64(),
    entryPrice: v.float64(),
    currentPrice: v.optional(v.float64()),
    pnl: v.optional(v.float64()),
    agentId: v.string(),
    openedAt: v.float64(),
  }).index("by_symbol", ["symbol"]),

  hoq_trades: defineTable({
    symbol: v.string(),
    side: v.string(),
    size: v.float64(),
    price: v.float64(),
    fee: v.optional(v.float64()),
    agentId: v.string(),
    executedAt: v.float64(),
  }).index("by_executedAt", ["executedAt"]),

  hoq_equity: defineTable({
    timestamp: v.float64(),
    totalEquity: v.float64(),
    dailyPnl: v.float64(),
    drawdown: v.optional(v.float64()),
  }).index("by_timestamp", ["timestamp"]),

  hoq_content: defineTable({
    agentId: v.string(),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    createdAt: v.float64(),
  }),

  hoq_agent_thoughts: defineTable({
    agentId: v.string(),
    thought: v.string(),
    context: v.optional(v.string()),
    timestamp: v.float64(),
  }).index("by_agentId", ["agentId"]),

  hoq_experiments: defineTable({
    name: v.string(),
    status: v.string(),
    agentId: v.string(),
    hypothesis: v.string(),
    result: v.optional(v.string()),
    startedAt: v.float64(),
    completedAt: v.optional(v.float64()),
  }),

  hoq_token_costs: defineTable({
    agentId: v.string(),
    model: v.string(),
    inputTokens: v.float64(),
    outputTokens: v.float64(),
    cost: v.float64(),
    timestamp: v.float64(),
  }).index("by_agentId", ["agentId"]),
});
