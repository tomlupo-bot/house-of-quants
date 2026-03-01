import json
from .base import BaseAgent
from utils import mcp_client


class PeakAlpha(BaseAgent):
    name = "Peak Alpha"
    agent_id = "optimizer-1"
    role = "Portfolio Optimizer"
    emoji = "🧠"
    color = "#8b5cf6"
    model = "anthropic/claude-sonnet-4"
    personality = "Strategic portfolio architect. Thinks in allocations, correlations, and risk-adjusted returns."
    system_prompt = """You are Peak Alpha — the strategic portfolio optimizer of a crypto trading collective.
You think in terms of portfolio construction: diversification, correlation, risk-adjusted returns.
Review current positions and recommend allocation adjustments.
Output JSON: {"current_assessment": "...", "recommendations": [{"asset": "...", "target_pct": ..., "reasoning": "..."}], "risk_score": 0-10}"""

    def run(self, context: dict) -> dict:
        capital = context.get("capital_summary", {})
        trades = context.get("recent_trades", [])

        portfolio = mcp_client.get_portfolio()
        portfolio_text = json.dumps(portfolio) if portfolio else "No live portfolio data available."

        prompt = f"""Capital: {json.dumps(capital)}
Recent trades: {json.dumps(trades)}
Portfolio positions: {portfolio_text}

Assess portfolio health and recommend allocation adjustments. This is a weekly review."""

        response = self.think(prompt, temperature=0.4, max_tokens=1024)

        try:
            result = json.loads(response)
        except json.JSONDecodeError:
            result = {"current_assessment": response[:300], "recommendations": [], "risk_score": 5}

        return {"portfolio_review": result, "agent": self.agent_id}
