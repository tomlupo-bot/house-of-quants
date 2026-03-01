import json
import logging
from urllib.request import Request, urlopen
from urllib.error import URLError

log = logging.getLogger("mcp_client")

SERVERS = {
    "math": "http://localhost:8000",
    "price": "http://localhost:8003",
    "crypto_trade": "http://localhost:8005",
    "indicators": "http://localhost:8006",
    "portfolio": "http://localhost:8007",
}


def call_tool(server: str, tool_name: str, arguments: dict, timeout: int = 30) -> dict | None:
    """Call an MCP tool server. Returns result dict or None on failure."""
    base_url = SERVERS.get(server)
    if not base_url:
        log.warning(f"Unknown MCP server: {server}")
        return None

    payload = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": tool_name, "arguments": arguments},
    }).encode()

    req = Request(f"{base_url}/mcp", data=payload, method="POST")
    req.add_header("Content-Type", "application/json")

    try:
        with urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read())
            if "error" in data:
                log.error(f"MCP {server}/{tool_name} error: {data['error']}")
                return None
            result = data.get("result", {})
            # Extract text content from MCP response
            content = result.get("content", [])
            if content and isinstance(content, list):
                text = content[0].get("text", "")
                try:
                    return json.loads(text)
                except (json.JSONDecodeError, TypeError):
                    return {"text": text}
            return result
    except (URLError, Exception) as e:
        log.debug(f"MCP {server}/{tool_name} unavailable: {e}")
        return None


def get_price(symbol: str, interval: str = "1h", limit: int = 24) -> dict | None:
    return call_tool("price", "get_ohlcv", {"symbol": symbol, "interval": interval, "limit": limit})


def get_indicators(symbol: str, indicator: str = "rsi", period: int = 14) -> dict | None:
    return call_tool("indicators", "calculate", {"symbol": symbol, "indicator": indicator, "period": period})


def execute_trade(symbol: str, side: str, size: float, price: float = 0) -> dict | None:
    return call_tool("crypto_trade", "execute", {"symbol": symbol, "side": side, "size": size, "price": price})


def get_portfolio() -> dict | None:
    return call_tool("portfolio", "get_positions", {})
