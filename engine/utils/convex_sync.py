import os
import json
import time
import logging
from urllib.request import Request, urlopen
from urllib.error import URLError

log = logging.getLogger("convex_sync")

CONVEX_URL = os.environ.get("CONVEX_URL", "https://giant-eel-625.eu-west-1.convex.cloud")
DEPLOY_KEY = os.environ.get("CONVEX_DEPLOY_KEY", "")


def _call(fn_path: str, args: dict) -> dict | None:
    """Call a Convex mutation/action via HTTP API."""
    if not DEPLOY_KEY:
        log.warning("CONVEX_DEPLOY_KEY not set — skipping sync")
        return None

    url = f"{CONVEX_URL}/api/mutation"
    payload = json.dumps({"path": fn_path, "args": args, "format": "json"}).encode()

    req = Request(url, data=payload, method="POST")
    req.add_header("Authorization", f"Convex {DEPLOY_KEY}")
    req.add_header("Content-Type", "application/json")

    try:
        with urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            if data.get("status") == "error":
                log.error(f"Convex error for {fn_path}: {data}")
                return None
            return data.get("value")
    except (URLError, Exception) as e:
        log.error(f"Convex sync failed for {fn_path}: {e}")
        return None


def upsert_agent(agent_id: str, name: str, status: str, last_thought: str,
                 model: str, tokens_used: int = 0, cost_usd: float = 0.0,
                 personality: str = "", pnl: float = 0.0):
    return _call("agents:upsertAgent", {
        "agentId": agent_id,
        "name": name,
        "status": status,
        "lastThought": last_thought,
        "model": model,
        "tokensUsed": tokens_used,
        "costUsd": cost_usd,
        "personality": personality,
        "pnl": pnl,
    })


def add_signal(agent_id: str, asset: str, direction: str, confidence: float,
               reasoning: str, approved: bool = False):
    return _call("signals:addSignal", {
        "agentId": agent_id,
        "asset": asset,
        "direction": direction,
        "confidence": confidence,
        "reasoning": reasoning,
        "approved": approved,
    })


def add_trade(agent_id: str, asset: str, side: str, size: float,
              price: float, pnl: float = 0.0):
    return _call("trades:addTrade", {
        "agentId": agent_id,
        "asset": asset,
        "side": side,
        "size": size,
        "price": price,
        "pnl": pnl,
    })


def update_capital(total: float, token_costs: float, trading_pnl: float, tier: str):
    return _call("capital:updateCapital", {
        "total": total,
        "tokenCosts": token_costs,
        "tradingPnl": trading_pnl,
        "tier": tier,
    })


def add_log(agent_id: str, message: str, level: str = "info"):
    return _call("logs:addLog", {
        "agentId": agent_id,
        "message": message,
        "level": level,
    })
