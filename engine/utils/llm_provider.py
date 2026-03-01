import os
import json
import time
import logging
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

log = logging.getLogger("llm_provider")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = os.environ.get("OPENROUTER_API_KEY", "")

# Approximate costs per 1M tokens (USD)
MODEL_COSTS = {
    "google/gemini-2.0-flash-001": {"input": 0.10, "output": 0.40},
    "google/gemini-2.0-pro-exp-02-05": {"input": 1.25, "output": 5.00},
    "anthropic/claude-sonnet-4-20250514": {"input": 3.00, "output": 15.00},
    "deepseek/deepseek-chat-v3-0324": {"input": 0.27, "output": 1.10},
}

def chat(model: str, messages: list, temperature: float = 0.7, max_tokens: int = 2048) -> dict:
    """Call OpenRouter chat completions. Returns {content, usage, cost_usd}."""
    if not API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY not set")

    payload = json.dumps({
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }).encode()

    req = Request(OPENROUTER_URL, data=payload, method="POST")
    req.add_header("Authorization", f"Bearer {API_KEY}")
    req.add_header("Content-Type", "application/json")
    req.add_header("HTTP-Referer", "https://house-of-quants.openclaw.ai")
    req.add_header("X-Title", "House of Quants")

    try:
        with urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
    except (URLError, HTTPError) as e:
        log.error(f"OpenRouter error: {e}")
        raise

    choice = data.get("choices", [{}])[0]
    content = choice.get("message", {}).get("content", "")
    usage = data.get("usage", {})
    prompt_tokens = usage.get("prompt_tokens", 0)
    completion_tokens = usage.get("completion_tokens", 0)

    costs = MODEL_COSTS.get(model, {"input": 1.0, "output": 3.0})
    cost_usd = (prompt_tokens * costs["input"] + completion_tokens * costs["output"]) / 1_000_000

    return {
        "content": content,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": prompt_tokens + completion_tokens,
        "cost_usd": cost_usd,
        "model": model,
    }


def mock_chat(model: str, messages: list, **kwargs) -> dict:
    """Mock LLM call for dry-run mode."""
    last_msg = messages[-1]["content"] if messages else ""
    return {
        "content": f"[DRY-RUN mock response for {model}]\nBased on: {last_msg[:100]}...",
        "prompt_tokens": 100,
        "completion_tokens": 50,
        "total_tokens": 150,
        "cost_usd": 0.0001,
        "model": model,
    }
