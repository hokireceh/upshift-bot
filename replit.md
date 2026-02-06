# Upshift Finance Telegram Bot

## Overview

This is a Telegram bot that automates daily reward claiming from Upshift Finance. Users interact with the bot through inline keyboard menus to check their streak status, claim points, view total points, and manage wallet settings. The bot also supports scheduled auto-claiming via cron jobs.

The bot is built as a single-purpose Node.js application using ES modules (`"type": "module"` in package.json). It has no database — all state (user wallets, auto-claim preferences) is stored in-memory using JavaScript `Map` objects, meaning data is lost on restart.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Structure

```
├── index.js                    # Entry point - bot initialization, middleware, route registration
├── config.js                   # Environment config loader (dotenv-based)
├── handlers/
│   ├── callbacks.js            # Telegram callback/command handlers (business logic)
│   └── menu.js                 # Inline keyboard menus and message templates
├── services/
│   └── upshiftService.js       # HTTP client for Upshift Finance API
├── scheduler/
│   └── autoClaim.js            # Cron-based auto-claim scheduler
```

### Bot Framework

- **Telegraf v4** is used as the Telegram Bot framework. It handles commands, inline keyboard callbacks, and session management.
- The bot uses `session` middleware from Telegraf (imported but session state handling appears minimal).
- All user interaction is menu-driven via inline keyboards — no slash commands beyond `/start` and `/help`.

### State Management

- **In-memory Maps** (`userWallets`, `autoClaimEnabled`) store per-user wallet addresses and auto-claim preferences. These are defined in `handlers/callbacks.js`.
- Default wallet addresses come from the `WALLET_ADDRESSES` environment variable in `.env`.
- **There is no database.** If persistence is needed, a database layer should be added to replace the Map-based storage.

### API Integration

- `upshiftService.js` wraps calls to the Upshift Finance API (`https://app.upshift.finance/api/proxy`).
- Uses `axios` for HTTP requests.
- Key endpoints: `/streak/claim` (POST), and likely streak status and total points endpoints (referenced in callbacks but service methods partially shown).
- Error handling distinguishes "already claimed today" (HTTP 429) from other failures.

### Scheduled Tasks

- `node-cron` runs auto-claim on a configurable schedule (default: `0 9 * * *` = 9 AM daily).
- Timezone defaults to `Asia/Jakarta`.
- The scheduler iterates through configured wallets and claims for each one.
- The `AutoClaimScheduler` class takes the bot instance to potentially send notifications back to users.

### Configuration

All configuration is loaded from environment variables via `dotenv`:

| Variable | Purpose | Default |
|----------|---------|---------|
| `TELEGRAM_BOT_TOKEN` | Bot authentication token from BotFather | Required |
| `WALLET_ADDRESSES` | Comma-separated Ethereum addresses | Required |
| `AUTO_CLAIM_SCHEDULE` | Cron expression for auto-claim timing | `0 9 * * *` |
| `OWNER_ID` | Telegram user ID for the bot owner | Optional |
| `UPSHIFT_API_URL` | Upshift Finance API base URL | `https://app.upshift.finance/api/proxy` |
| `LOG_LEVEL` | Logging verbosity | `info` |

### Entry Point

Run with `npm start` (or `npm run dev` for watch mode). The entry point is `index.js` which:
1. Validates required config (exits if no bot token)
2. Initializes the Telegraf bot with session middleware
3. Registers all command and callback handlers
4. Note: The file appears incomplete — it doesn't show `bot.launch()` or scheduler initialization, which need to be added at the bottom of `index.js`.

### Known Incomplete Areas

- `index.js` is truncated — missing `bot.launch()`, graceful shutdown handlers, and scheduler start.
- `handlers/callbacks.js` is truncated — several handler implementations are incomplete.
- `handlers/menu.js` is truncated — the `messages` object is partially defined.
- `autoClaimEnabled` and `userWallets` are not properly exported from `callbacks.js` for use in `autoClaim.js` (potential import issue).
- No persistent storage — all user data is lost on restart.

## External Dependencies

### NPM Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `telegraf` | ^4.16.3 | Telegram Bot framework |
| `axios` | ^1.13.4 | HTTP client for Upshift Finance API |
| `node-cron` | ^3.0.3 | Cron job scheduling for auto-claims |
| `dotenv` | ^16.6.1 | Environment variable loading |

### External APIs

- **Telegram Bot API** — via Telegraf, requires a bot token from @BotFather
- **Upshift Finance API** — `https://app.upshift.finance/api/proxy` for streak claiming, status checks, and points queries

### No Database

The application currently has no database. If persistence is needed (recommended for production), consider adding SQLite via better-sqlite3 or a similar lightweight solution to persist user wallets and auto-claim preferences across restarts.