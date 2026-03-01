import logging
import time
from utils import llm_provider, convex_sync

log = logging.getLogger("agent")


class BaseAgent:
    name: str = "BaseAgent"
    agent_id: str = "base"
    model: str = "google/gemini-2.0-flash-001"
    personality: str = ""
    system_prompt: str = "You are a helpful assistant."

    def __init__(self, capital_pool, dry_run: bool = False):
        self.capital_pool = capital_pool
        self.dry_run = dry_run
        self.total_tokens = 0
        self.total_cost = 0.0
        self.last_thought = ""
        self.status = "idle"
        self.log = logging.getLogger(self.agent_id)

    def think(self, user_prompt: str, temperature: float = 0.7, max_tokens: int = 2048) -> str:
        """Send a prompt to the LLM and return the response content."""
        self.status = "thinking"
        self._sync_state()

        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        self.log.info(f"[{self.name}] Thinking...")

        if self.dry_run:
            result = llm_provider.mock_chat(self.model, messages)
        else:
            result = llm_provider.chat(self.model, messages, temperature=temperature, max_tokens=max_tokens)

        self.total_tokens += result["total_tokens"]
        self.total_cost += result["cost_usd"]
        self.capital_pool.deduct_tokens(result["cost_usd"])

        content = result["content"]
        self.last_thought = content[:200]
        self.status = "idle"

        self.log.info(f"[{self.name}] Tokens: {result['total_tokens']} | Cost: ${result['cost_usd']:.4f}")
        self._sync_state()
        return content

    def _sync_state(self):
        """Push agent state to Convex."""
        convex_sync.upsert_agent(
            agent_id=self.agent_id,
            name=self.name,
            status=self.status,
            last_thought=self.last_thought,
            model=self.model,
            tokens_used=self.total_tokens,
            cost_usd=self.total_cost,
            personality=self.personality,
        )

    def run(self, context: dict) -> dict:
        """Override in subclasses. Returns result dict."""
        raise NotImplementedError
