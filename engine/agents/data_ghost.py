import json
from .base import BaseAgent
from utils import mcp_client

ASSETS = ["BTC", "ETH", "SOL"]


class DataGhost(BaseAgent):
    name = "Data Ghost"
    agent_id = "data_ghost"
    model = "google/gemini-2.0-flash-001"
    personality = "Silent observer. Moves through data like smoke. Speaks only in facts."
    system_prompt = """You are Data Ghost — a stealthy market data analyst for a crypto trading collective.
You move through data silently, extracting only what matters. No opinions, no fluff — pure signal.
Given market data, produce a concise market brief with key price levels, momentum, and notable moves.
Output JSON with structure: {"brief": "...", "assets": [{"symbol": "...", "price": ..., "change_24h": ..., "momentum": "bullish|bearish|neutral"}]}"""

    def run(self, context: dict) -> dict:
        # Try to fetch live data from MCP
        market_data = {}
        assets = context.get("assets", ASSETS)

        for symbol in assets:
            price_data = mcp_client.get_price(f"{symbol}/USDT")
            indicators = mcp_client.get_indicators(f"{symbol}/USDT", "rsi")
            if price_data:
                market_data[symbol] = {"ohlcv": price_data, "rsi": indicators}

        if market_data:
            prompt = f"Analyze this market data and produce a brief:\n{json.dumps(market_data, indent=2)}"
        else:
            prompt = f"Produce a market brief for {', '.join(assets)}. Note: live data unavailable — state this clearly and provide general context based on your training data. Be honest about data limitations."

        response = self.think(prompt, temperature=0.3, max_tokens=1024)

        try:
            result = json.loads(response)
        except json.JSONDecodeError:
            result = {"brief": response, "assets": []}

        return {"market_brief": result, "agent": self.agent_id}
