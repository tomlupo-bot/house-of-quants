#!/usr/bin/env python3
"""House of Quants — Agent Orchestrator

Runs the trading cycle: data → signals → risk review → execution → analysis → reporting.
Usage: python3 engine/orchestrator.py [--dry-run] [--cycles N]
"""

import argparse
import json
import logging
import os
import sys
import time
from datetime import datetime

# Add engine to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from capital_pool import CapitalPool
from agents import DataGhost, QuantumSeer, Guardian, BlitzBot, Oracle, PeakAlpha, Scribe
from utils import convex_sync

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)-14s] %(levelname)-5s %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("orchestrator")


def load_config(path: str = None) -> dict:
    if path is None:
        path = os.path.join(os.path.dirname(__file__), "configs", "default.json")
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        log.warning(f"Config not found at {path}, using defaults")
        return {"starting_capital": 10000, "max_cycles": 1, "assets": ["BTC", "ETH", "SOL"]}


def run_cycle(agents: dict, capital: CapitalPool, config: dict, cycle_num: int) -> dict:
    """Run one full trading cycle."""
    log.info(f"{'='*60}")
    log.info(f"CYCLE {cycle_num} — {datetime.utcnow().isoformat()}Z")
    log.info(f"Capital: ${capital.total:.2f} ({capital.tier})")
    log.info(f"{'='*60}")

    if not capital.is_alive:
        log.error("CAPITAL DEPLETED — collective is dead. Halting.")
        return {"halted": True}

    context = {
        "assets": config.get("assets", ["BTC", "ETH", "SOL"]),
        "capital_summary": capital.summary(),
        "recent_trades": [],
    }

    # 1. Data Ghost — gather market data
    log.info("▸ Phase 1: Data Ghost scanning markets...")
    result = agents["data_ghost"].run(context)
    context["market_brief"] = result.get("market_brief", {})

    # 2. Quantum Seer — generate signals
    log.info("▸ Phase 2: Quantum Seer generating signals...")
    result = agents["quantum_seer"].run(context)
    context["signals"] = result.get("signals", [])
    log.info(f"  Signals generated: {len(context['signals'])}")

    # 3. Guardian — risk review
    log.info("▸ Phase 3: Guardian reviewing signals...")
    result = agents["guardian"].run(context)
    context["approved_signals"] = result.get("approved_signals", [])
    rejected = result.get("rejected", 0)
    log.info(f"  Approved: {len(context['approved_signals'])} | Rejected: {rejected}")

    # 4. Blitz Bot — execute trades
    log.info("▸ Phase 4: Blitz Bot executing trades...")
    result = agents["blitz_bot"].run(context)
    context["trades"] = result.get("trades", [])
    context["recent_trades"] = context["trades"]
    log.info(f"  Trades executed: {len(context['trades'])}")

    # 5. Oracle — prediction markets
    log.info("▸ Phase 5: Oracle scanning prediction markets...")
    result = agents["oracle"].run(context)
    context["polymarket"] = result.get("polymarket", {})

    # 6. Peak Alpha — portfolio review (simplified: every cycle in demo)
    log.info("▸ Phase 6: Peak Alpha reviewing portfolio...")
    result = agents["peak_alpha"].run(context)
    context["portfolio_review"] = result.get("portfolio_review", {})

    # 7. Scribe — daily brief
    log.info("▸ Phase 7: Scribe writing brief...")
    result = agents["scribe"].run(context)
    brief = result.get("daily_brief", "")
    if brief:
        log.info(f"\n{'─'*60}")
        log.info("DAILY BRIEF:")
        log.info(f"{'─'*60}")
        for line in brief.split("\n")[:20]:
            log.info(f"  {line}")
        if brief.count("\n") > 20:
            log.info("  [... truncated]")
        log.info(f"{'─'*60}")

    # Sync capital to Convex
    convex_sync.update_capital(
        pool="Main Trading Pool",
        amount=capital.total,
        currency="USDT",
    )

    log.info(f"\nCycle {cycle_num} complete. Capital: ${capital.total:.2f} ({capital.tier})")
    return context


def main():
    parser = argparse.ArgumentParser(description="House of Quants — Agent Orchestrator")
    parser.add_argument("--dry-run", action="store_true", help="Use mock LLM responses")
    parser.add_argument("--cycles", type=int, default=1, help="Number of cycles to run")
    parser.add_argument("--config", type=str, help="Path to config JSON")
    args = parser.parse_args()

    config = load_config(args.config)

    if args.dry_run:
        log.info("🧪 DRY RUN MODE — using mock LLM responses")

    # Initialize capital pool
    capital = CapitalPool(starting=config.get("starting_capital", 10000))
    log.info(f"💰 Starting capital: ${capital.total:.2f}")

    # Initialize agents
    agents = {
        "data_ghost": DataGhost(capital, dry_run=args.dry_run),
        "quantum_seer": QuantumSeer(capital, dry_run=args.dry_run),
        "guardian": Guardian(capital, dry_run=args.dry_run),
        "blitz_bot": BlitzBot(capital, dry_run=args.dry_run),
        "oracle": Oracle(capital, dry_run=args.dry_run),
        "peak_alpha": PeakAlpha(capital, dry_run=args.dry_run),
        "scribe": Scribe(capital, dry_run=args.dry_run),
    }

    log.info(f"🤖 Initialized {len(agents)} agents")
    log.info(f"🔄 Running {args.cycles} cycle(s)")

    for i in range(1, args.cycles + 1):
        result = run_cycle(agents, capital, config, i)
        if result.get("halted"):
            break
        if i < args.cycles:
            interval = config.get("cycle_interval_seconds", 10)
            log.info(f"⏳ Next cycle in {interval}s...")
            time.sleep(min(interval, 5) if args.dry_run else interval)

    # Final summary
    log.info(f"\n{'='*60}")
    log.info("FINAL SUMMARY")
    log.info(f"{'='*60}")
    summary = capital.summary()
    for k, v in summary.items():
        log.info(f"  {k}: {v}")

    total_tokens = sum(a.total_tokens for a in agents.values())
    total_cost = sum(a.total_cost for a in agents.values())
    log.info(f"  total_tokens_all_agents: {total_tokens}")
    log.info(f"  total_cost_all_agents: ${total_cost:.4f}")
    log.info(f"{'='*60}")


if __name__ == "__main__":
    main()
