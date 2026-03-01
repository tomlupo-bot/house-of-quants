import os
import json
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


def upsert_agent(agent_id: str, name: str, role: str, emoji: str,
                 status: str, last_thought: str, color: str):
    return _call("hoq:upsertAgent", {
        "agentId": agent_id,
        "name": name,
        "role": role,
        "emoji": emoji,
        "status": status,
        "lastThought": last_thought,
        "color": color,
    })


def add_signal(agent_id: str, signal_type: str, message: str,
               severity: str = "info"):
    return _call("hoq:addSignal", {
        "agentId": agent_id,
        "type": signal_type,
        "message": message,
        "severity": severity,
    })


def add_trade(symbol: str, side: str, size: float, price: float,
              agent_id: str, fee: float = 0.0):
    return _call("hoq:addTrade", {
        "symbol": symbol,
        "side": side,
        "size": size,
        "price": price,
        "agentId": agent_id,
        "fee": fee,
    })


def update_capital(pool: str, amount: float, currency: str = "USDT",
                   allocated_to: str | None = None):
    args = {"pool": pool, "amount": amount, "currency": currency}
    if allocated_to:
        args["allocatedTo"] = allocated_to
    return _call("hoq:updateCapital", args)


def add_thought(agent_id: str, thought: str, context: str | None = None):
    args = {"agentId": agent_id, "thought": thought}
    if context:
        args["context"] = context
    return _call("hoq:addThought", args)


def add_token_cost(agent_id: str, model: str, input_tokens: int,
                   output_tokens: int, cost: float):
    return _call("hoq:addTokenCost", {
        "agentId": agent_id,
        "model": model,
        "inputTokens": float(input_tokens),
        "outputTokens": float(output_tokens),
        "cost": cost,
    })


def add_equity_snapshot(total_equity: float, daily_pnl: float,
                        drawdown: float | None = None):
    args = {"totalEquity": total_equity, "dailyPnl": daily_pnl}
    if drawdown is not None:
        args["drawdown"] = drawdown
    return _call("hoq:addEquitySnapshot", args)


def upsert_position(symbol: str, side: str, size: float, entry_price: float,
                     agent_id: str, current_price: float | None = None,
                     pnl: float | None = None):
    args = {
        "symbol": symbol, "side": side, "size": size,
        "entryPrice": entry_price, "agentId": agent_id,
    }
    if current_price is not None:
        args["currentPrice"] = current_price
    if pnl is not None:
        args["pnl"] = pnl
    return _call("hoq:upsertPosition", args)


def add_content(agent_id: str, content_type: str, title: str, body: str):
    return _call("hoq:addContent", {
        "agentId": agent_id,
        "type": content_type,
        "title": title,
        "body": body,
    })


def add_log(agent_id: str, message: str, level: str = "info"):
    """Legacy log call — routes to addSignal."""
    return add_signal(agent_id, "log", message, severity=level)
