# Go MT5 Broadcast Worker

This sidecar adds the fast fan-out path that the current Node server is missing.

It does three things:

1. Accepts a trade signal over HTTP.
2. Pulls active followers for a master trader from Supabase.
3. Sends the signal to an MT5 bridge concurrently using goroutines.

## Why this exists

`api/server-real.js` currently broadcasts in a sequential loop. This worker gives you a separate service that can fan out the same signal across many follower accounts in parallel.

## Expected follower schema

The worker reads from a Supabase table that returns rows shaped like this:

```json
{
  "id": "follower_001",
  "master_id": "master_alpha",
  "username": "victor",
  "account_id": "12345678",
  "login": "12345678",
  "password": "secret",
  "server": "Exness-MT5Real6",
  "bridge_account_id": "mt5-terminal-01",
  "volume_factor": 1.0,
  "active": true,
  "metadata": {
    "risk_profile": "balanced"
  }
}
```

Only `master_id`, `active`, and enough MT5 identity fields for your bridge are required. You can adjust the queried column names with env vars.

## Expected MT5 bridge contract

The worker posts each follower execution to:

`POST {MT5_BRIDGE_URL}{MT5_BRIDGE_PATH}`

Payload:

```json
{
  "follower_id": "follower_001",
  "account_id": "12345678",
  "login": "12345678",
  "password": "secret",
  "server": "Exness-MT5Real6",
  "bridge_account_id": "mt5-terminal-01",
  "trade": {
    "master_id": "master_alpha",
    "symbol": "EURUSD",
    "action": "BUY",
    "volume": 0.01,
    "stop_loss": 1.09,
    "take_profit": 1.11,
    "comment": "Impulse test"
  }
}
```

A successful bridge response should ideally return JSON with fields like:

```json
{
  "status": "FILLED",
  "order_id": "987654321"
}
```

## Setup

1. Install Go 1.22+ on your VPS or local machine.
2. Copy `.env.example` to `.env`.
3. Set your Supabase URL and service role key.
4. Point `MT5_BRIDGE_URL` to your local MT5 WebSocket or REST bridge adapter.
5. Run:

```bash
go run .
```

The worker listens on `http://localhost:8081` by default.

## Test request

Use `DRY_RUN=true` first so you can verify Supabase fan-out without placing real trades.

```bash
curl -X POST http://localhost:8081/signals/execute \
  -H "Content-Type: application/json" \
  -d '{
    "master_id": "master_alpha",
    "symbol": "EURUSD",
    "action": "BUY",
    "volume": 0.01,
    "stop_loss": 1.09,
    "take_profit": 1.11,
    "comment": "Impulse test"
  }'
```

## Suggested next integration

Once this worker is running, the Node API can forward `/api/signals/:id/broadcast` to this service instead of executing followers serially in-process.
