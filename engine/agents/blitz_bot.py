import json
from .base import BaseAgent
from utils import mcp_client, convex_sync


class BlitzBot(BaseAgent):
    name = "Blitz Bot"
    agent_id = "blitz_bot"
    model = "google/gemini-2.0-flash-001"
    personality = "Pure execution machine. No hesitation. Confirms, executes, reports."
    system_prompt = """You are Blitz Bot — the execution arm of a crypto trading collective.
You receive approved signals and execute them. No second-guessing — Guardian already approved.
For each trade, determine exact entry parameters.
Output JSON array: [{"asset": "...", "side": "buy|sell", "size_usd": ..., "order_type": "market|limit", "reasoning": "..."}]"""

    def run(self, context: dict) -> dict:
        approved = context.get("approved_signals", [])
        capital = context.get("capital_summary", {})

        if not approved:
            self.last_thought = "No approved signals to execute."
            self._sync_state()
            return {"trades": [], "agent": self.agent_id}

        prompt = f"""Capital: ${capital.get('total', 0):.2f}
Approved signals:
{json.dumps(approved, indent=2)}

Determine execution parameters for each."""

        response = self.think(prompt, temperature=0.2, max_tokens=512)

        try:
            orders = json.loads(response)
            if not isinstance(orders, list):
                orders = [orders]
        except json.JSONDecodeError:
            orders = []

        trades = []
        for order in orders:
            asset = order.get("asset", "?")
            side = order.get("side", "buy")
            size = order.get("size_usd", 0)

            # Try MCP execution
            result = mcp_client.execute_trade(f"{asset}/USDT", side, size)
            if result:
                price = result.get("price", 0)
            else:
                price = 0  # Simulated

            trade = {"asset": asset, "side": side, "size": size, "price": price, "executed": result is not None}
            trades.append(trade)

            convex_sync.add_trade(self.agent_id, asset, side, size, price)

        return {"trades": trades, "agent": self.agent_id}
