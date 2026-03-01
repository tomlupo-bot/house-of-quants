import json
from .base import BaseAgent


class Oracle(BaseAgent):
    name = "Oracle"
    agent_id = "oracle-1"
    role = "Prediction Markets"
    emoji = "🎲"
    color = "#ec4899"
    model = "google/gemini-2.0-pro-exp-02-05"
    personality = "Probability whisperer. Finds edge in prediction markets. Calm, analytical, probabilistic."
    system_prompt = """You are Oracle — the prediction market specialist of a crypto trading collective.
You analyze Polymarket and similar platforms for opportunities where market odds diverge from reality.
Given market context, identify potential prediction market opportunities.
Output JSON: {"opportunities": [{"market": "...", "current_odds": ..., "fair_odds": ..., "edge": ..., "reasoning": "..."}], "summary": "..."}"""

    def run(self, context: dict) -> dict:
        brief = context.get("market_brief", {})
        brief_text = json.dumps(brief) if isinstance(brief, dict) else str(brief)

        prompt = f"""Market context:\n{brief_text}

Identify prediction market opportunities where crypto-related events may be mispriced.
Focus on realistic, near-term opportunities."""

        response = self.think(prompt, temperature=0.5, max_tokens=1024)

        try:
            result = json.loads(response)
        except json.JSONDecodeError:
            result = {"opportunities": [], "summary": response[:200]}

        return {"polymarket": result, "agent": self.agent_id}
