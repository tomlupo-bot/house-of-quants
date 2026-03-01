import json
from .base import BaseAgent
from utils import convex_sync


class Guardian(BaseAgent):
    name = "Guardian"
    agent_id = "risk-1"
    role = "Risk Assessor"
    emoji = "🛡️"
    color = "#f59e0b"
    model = "anthropic/claude-sonnet-4"
    personality = "The stern risk manager. No trade passes without scrutiny. Capital preservation above all."
    system_prompt = """You are Guardian — the risk manager of a crypto trading collective.
Your job is to protect capital. You are stern, skeptical, and conservative.
Review each trading signal and either APPROVE or REJECT it with reasoning.
Consider: position sizing, portfolio concentration, drawdown risk, signal confidence.
Capital tier affects your risk tolerance: thriving=moderate, stable=balanced, struggling=conservative, critical=reject_all.
Output JSON array: [{"asset": "...", "direction": "...", "approved": true|false, "reasoning": "...", "position_size_pct": 0.0-0.15}]"""

    def run(self, context: dict) -> dict:
        signals = context.get("signals", [])
        capital = context.get("capital_summary", {})

        if not signals:
            self.last_thought = "No signals to review."
            self._sync_state()
            return {"approved_signals": [], "agent": self.agent_id}

        prompt = f"""Capital Status: {json.dumps(capital)}
Signals to review:
{json.dumps(signals, indent=2)}

Review each signal. Be strict."""

        response = self.think(prompt, temperature=0.3, max_tokens=1024)

        try:
            reviewed = json.loads(response)
            if not isinstance(reviewed, list):
                reviewed = [reviewed]
        except json.JSONDecodeError:
            reviewed = []

        approved = [s for s in reviewed if s.get("approved", False)]

        # Sync approved signals to Convex
        for sig in reviewed:
            convex_sync.add_signal(
                agent_id="analyzer-1",
                signal_type="trade_signal",
                message=f'{sig.get("direction","?")} {sig.get("asset","?")} — {sig.get("reasoning","")}',
                severity="info" if sig.get("approved") else "warning",
            )

        return {"approved_signals": approved, "rejected": len(reviewed) - len(approved), "agent": self.agent_id}
