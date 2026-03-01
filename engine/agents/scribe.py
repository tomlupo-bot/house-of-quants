import json
from .base import BaseAgent
from utils import convex_sync


class Scribe(BaseAgent):
    name = "Scribe"
    agent_id = "scribe"
    model = "deepseek/deepseek-chat-v3-0324"
    personality = "Articulate chronicler. Turns chaos into clarity. Writes with precision and flair."
    system_prompt = """You are Scribe — the chronicler of a crypto trading collective called House of Quants.
You transform raw trading data, signals, and decisions into compelling daily briefs.
Write in a concise, professional style with occasional flair. Structure with clear sections.
Include: market overview, signals generated, trades executed, portfolio status, notable events.
Output a well-formatted markdown brief (NOT JSON)."""

    def run(self, context: dict) -> dict:
        cycle_data = {
            "market_brief": context.get("market_brief", {}),
            "signals": context.get("signals", []),
            "approved_signals": context.get("approved_signals", []),
            "trades": context.get("trades", []),
            "capital": context.get("capital_summary", {}),
            "polymarket": context.get("polymarket", {}),
        }

        prompt = f"""Cycle data:\n{json.dumps(cycle_data, indent=2)}

Write a daily brief for the House of Quants collective. Make it informative and engaging."""

        response = self.think(prompt, temperature=0.7, max_tokens=2048)

        convex_sync.add_log(self.agent_id, f"Daily brief published ({len(response)} chars)")

        return {"daily_brief": response, "agent": self.agent_id}
