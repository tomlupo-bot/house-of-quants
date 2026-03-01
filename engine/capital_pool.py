import logging
import threading

log = logging.getLogger("capital_pool")

STARTING_CAPITAL = 10_000.0

TIERS = [
    (1.20, "thriving"),
    (0.995, "stable"),
    (0.80, "struggling"),
    (0.60, "critical"),
    (0.00, "dead"),
]


class CapitalPool:
    def __init__(self, starting: float = STARTING_CAPITAL):
        self.starting = starting
        self.total = starting
        self.token_costs = 0.0
        self.trading_pnl = 0.0
        self._lock = threading.Lock()

    @property
    def ratio(self) -> float:
        return self.total / self.starting if self.starting > 0 else 0

    @property
    def tier(self) -> str:
        r = self.ratio
        for threshold, name in TIERS:
            if r >= threshold:
                return name
        return "dead"

    @property
    def is_alive(self) -> bool:
        return self.tier != "dead"

    def deduct_tokens(self, cost_usd: float):
        with self._lock:
            self.token_costs += cost_usd
            self.total -= cost_usd
            log.info(f"Token cost: ${cost_usd:.4f} | Capital: ${self.total:.2f} ({self.tier})")

    def add_pnl(self, pnl: float):
        with self._lock:
            self.trading_pnl += pnl
            self.total += pnl
            log.info(f"Trading P&L: ${pnl:+.2f} | Capital: ${self.total:.2f} ({self.tier})")

    def summary(self) -> dict:
        return {
            "total": round(self.total, 2),
            "starting": self.starting,
            "token_costs": round(self.token_costs, 4),
            "trading_pnl": round(self.trading_pnl, 2),
            "ratio": round(self.ratio, 4),
            "tier": self.tier,
            "alive": self.is_alive,
        }
