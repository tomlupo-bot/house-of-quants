import json
from .base import BaseAgent


class QuantumSeer(BaseAgent):
    name = "Quantum Seer"
    agent_id = "analyzer-1"
    role = "Signal Generator"
    emoji = "📈"
    color = "#10b981"
    model = "google/gemini-2.5-pro-preview-03-25"
    personality = "Sees patterns in chaos. Speaks in probabilities. Cryptic but precise."
    system_prompt = """You are Quantum Seer — a signal generator who finds patterns where others see noise.
You speak in probabilities, not certainties. Every signal comes with a confidence score.
Given a market brief, generate trading signals.
Output JSON array: [{"asset": "BTC", "direction": "long|short", "confidence": 0.0-1.0, "reasoning": "..."}]
Only generate signals with confidence > 0.5. Max 3 signals per cycle."""

    def run(self, context: dict) -> dict:
        brief = context.get("market_brief", {})
        brief_text = json.dumps(brief) if isinstance(brief, dict) else str(brief)

        prompt = f"Market Brief:\n{brief_text}\n\nGenerate trading signals based on this data."
        response = self.think(prompt, temperature=0.5, max_tokens=1024)

        try:
            signals = json.loads(response)
            if not isinstance(signals, list):
                signals = [signals]
        except json.JSONDecodeError:
            signals = []

        return {"signals": signals, "agent": self.agent_id}
