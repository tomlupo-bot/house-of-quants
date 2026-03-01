# House of Quants — Agent Engine

Python orchestrator that runs a collective of AI trading agents.

## Quick Start

```bash
pip install -r requirements.txt

# Dry run (mock LLM calls)
python3 orchestrator.py --dry-run

# Live run (requires OPENROUTER_API_KEY)
python3 orchestrator.py --cycles 1
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes (live) | OpenRouter API key |
| `CONVEX_DEPLOY_KEY` | No | Convex deploy key for dashboard sync |
| `CONVEX_URL` | No | Convex URL (default: giant-eel-625) |

## Agents

| Agent | Model | Role |
|-------|-------|------|
| Data Ghost | Gemini Flash | Market data scanner |
| Quantum Seer | Gemini Pro | Signal generator |
| Guardian | Claude Sonnet | Risk manager (veto power) |
| Blitz Bot | Gemini Flash | Trade executor |
| Oracle | Gemini Pro | Prediction markets |
| Peak Alpha | Claude Sonnet | Portfolio optimizer |
| Scribe | DeepSeek V3 | Daily brief writer |

## Architecture

```
Orchestrator → Data Ghost → Quantum Seer → Guardian → Blitz Bot
                                                    → Oracle
                                                    → Peak Alpha
                                                    → Scribe
```

Capital pool ($10K) funds both token costs and trades. Survival tiers determine risk tolerance.
