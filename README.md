<p align="center">
  <img src="https://lh3.googleusercontent.com/aida/ADBb0ugomR1opaiB7fBL3L0d90eh9DO-zm5qWRHCgwPa6mI9YBuXFC3XrGYSkdo7qNhli86J5U6BjphKq9-Xfr1vR1oaCe4-1-lE0xQw_ZEUEFiteZ00LOxjrKEgRdDWjCiQQdkrZUAyt9oWTRBT3eRlshRG1VUoEGMReNLV50ZX_-7xHaMKTGQzFbkxXlMewDZEIBlaeY2iTSjL1uU0crsz_t_EZ4cApjhUH3qOs9ZuInQck8AswNtjlzk5l1rvM20glakQ1GjlReRENw" width="80" />
</p>

<h1 align="center">KabarChog_</h1>

<p align="center">
  <strong>AI-Powered Market Intelligence for the Decentralized Era</strong>
</p>

<p align="center">
  Real-time news → AI analysis → Structured sentiment & trading signals → Monetized via x402 micropayments
</p>

<p align="center">
  <a href="#-architecture--data-flow">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-endpoints">API Endpoints</a> •
  <a href="#-payment-flow-x402">Payment Flow</a>
</p>

---

## 📋 Overview

**KabarChog** is an end-to-end market intelligence platform that:

1. **Scrapes** breaking news from Telegram channels in real-time
2. **Analyzes** each message with AI to extract sentiment, impact, and trading signals
3. **Stores** structured intelligence in a PostgreSQL database
4. **Serves** premium data through REST APIs protected by **x402 micropayments** on the Monad testnet
5. **Notifies** users via a Telegram bot when significant market events are detected

---

## 🏗 Architecture & Data Flow

The system consists of two main modules — a **Python scraper** and a **Next.js web app** — connected through a shared **Neon PostgreSQL** database.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           KabarChog Architecture                            │
└──────────────────────────────────────────────────────────────────────────────┘

                          ┌─────────────────┐
                          │   TELEGRAM       │
                          │   CHANNELS       │
                          │                  │
                          │  @marketfeed     │
                          │  @WatcherGuru    │
                          │  KabarChog News  │
                          └────────┬─────────┘
                                   │
                           ① Live Messages
                           + History Sync
                                   │
                                   ▼
                     ┌──────────────────────────┐
                     │   SCRAPER (Python)        │
                     │                          │
                     │  ┌────────────────────┐  │
                     │  │  market_scraper.py │  │
                     │  │  (Telethon Client) │  │
                     │  └────────┬───────────┘  │
                     │           │              │
                     │     ② Raw message text   │
                     │           │              │
                     │           ▼              │
                     │  ┌────────────────────┐  │
                     │  │  ai_processor.py   │  │
                     │  │                    │  │
                     │  │  System Prompt:    │  │
                     │  │  "Analyze against  │  │
                     │  │   watchlist..."    │  │
                     │  │                    │  │
                     │  │  Output JSON:      │  │
                     │  │  • headline        │  │
                     │  │  • summary         │  │
                     │  │  • sentiment       │  │
                     │  │  • confidence      │  │
                     │  │  • impact_assets[] │  │
                     │  │  • categories[]    │  │
                     │  │  • tags[]          │  │
                     │  └────────┬───────────┘  │
                     │           │              │
                     │     ③ Structured JSON    │
                     │           │              │
                     │           ▼              │
                     │  ┌────────────────────┐  │
                     │  │    database.py     │  │
                     │  │  (psycopg2)       │  │
                     │  └────────┬───────────┘  │
                     └───────────┼───────────────┘
                                 │
                    ④ INSERT + Deduplication
                    (ON CONFLICT DO NOTHING)
                                 │
                                 ▼
                     ┌──────────────────────────┐
                     │    NEON POSTGRESQL        │
                     │                          │
                     │  ┌──────────┐ ┌────────┐ │
                     │  │ assets   │ │market_ │ │
                     │  │(watchlist│ │events  │ │
                     │  │ BTC,ETH, │ │(scraped│ │
                     │  │ SOL,MON, │ │+analyzed│ │
                     │  │ XAU,OIL) │ │ data)  │ │
                     │  └──────────┘ └────────┘ │
                     └───────────┬───────────────┘
                                 │
                    ⑤ SELECT (pg driver)
                                 │
                                 ▼
                     ┌──────────────────────────┐
                     │   WEB APP (Next.js)       │
                     │                          │
                     │  ┌────────────────────┐  │
                     │  │  API Routes        │  │
                     │  │                    │  │
                     │  │  /api/feed/live    │  │
                     │  │  /api/feed/ticker  │  │
                     │  │  /api/digest/*     │  │
                     │  │  /api/analyze      │  │
                     │  │  /api/ticker/*/... │  │
                     │  │  /premium          │  │
                     │  └────────┬───────────┘  │
                     │           │              │
                     │     ⑥ x402 Middleware    │
                     │     (withX402 wrapper)   │
                     │           │              │
                     │           ▼              │
                     │  ┌────────────────────┐  │
                     │  │  Response JSON     │  │
                     │  └────────────────────┘  │
                     └───────────┼───────────────┘
                                 │
                    ⑦ Paid Response
                    (USDC on Monad Testnet)
                                 │
                    ┌────────────┴─────────────┐
                    ▼                          ▼
          ┌──────────────┐          ┌───────────────┐
          │   WEB UI     │          │   AI AGENTS   │
          │  (Browser)   │          │  (API Client) │
          │              │          │               │
          │  Landing Page│          │  Any bot that  │
          │  Dashboard   │          │  calls our API │
          │  API Explorer│          │  with x402     │
          └──────────────┘          └───────────────┘
```

### Data Flow Step-by-Step

| Step | What Happens | Component |
|------|-------------|-----------|
| **①** | Telegram messages are received in real-time via Telethon. On startup, it also syncs the last 2 days of history. | `market_scraper.py` |
| **②** | Each message (>10 chars) is deduplicated by `(msg_id, channel)`, then sent to the AI processor. | `market_scraper.py` → `ai_processor.py` |
| **③** | AI analyzes the raw text against the active watchlist (BTC, ETH, SOL, etc.) and returns structured JSON with sentiment, confidence score, and per-asset impact analysis. | `ai_processor.py` |
| **④** | The structured event is saved to PostgreSQL with `ON CONFLICT DO NOTHING` to prevent duplicates. A Telegram notification is also sent if a bot token is configured. | `database.py` |
| **⑤** | The Next.js API routes query the database for events, aggregations, and ticker-specific data. | `web/src/lib/db.ts` |
| **⑥** | Premium endpoints are wrapped with `withX402()` middleware, requiring a USDC micropayment before returning data. | `web/src/lib/x402.ts` |
| **⑦** | Clients (browser or AI agents) pay via x402 to receive structured intelligence as JSON. | Consumer |

---

## 🔧 Tech Stack

### Scraper (Python)

| Technology | Purpose |
|-----------|---------|
| **Telethon** | Telegram MTProto client for scraping channels |
| **psycopg2** | PostgreSQL driver for Python |
| **python-dotenv** | Environment variable management |
| **requests** | HTTP client for AI API calls and Telegram Bot notifications |
| **asyncio** | Concurrent message processing with semaphore-based rate limiting |

### Web App (Next.js / TypeScript)

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with API routes |
| **TypeScript** | Type-safe codebase |
| **wagmi v3 + viem** | Wallet connection & EVM interaction |
| **@x402/core, @x402/evm, @x402/next** | x402 payment protocol (micropayments) |
| **pg** | PostgreSQL driver for Node.js |
| **Motion (Framer Motion)** | Animations & transitions |
| **Lucide React** | Icon library |
| **TailwindCSS v4** | Utility-first CSS framework |
| **@tanstack/react-query** | Server state management |

### Infrastructure

| Technology | Purpose |
|-----------|---------|
| **Neon PostgreSQL** | Serverless managed Postgres (shared between scraper & web) |
| **AI API** (OpenAI-compatible) | LLM for sentiment analysis, trading plans, and digest generation |
| **CoinGecko API** | Live crypto price data & OHLC charts |
| **Monad Testnet** | EVM chain for x402 USDC micropayments |
| **x402 Facilitator** | Payment verification service (`x402-facilitator.molandak.org`) |

---

## 🧠 AI Processing Pipeline

### How Raw News Becomes Structured Intelligence

```
┌─────────────────┐     ┌─────────────────────────────────────┐     ┌────────────────────┐
│   Raw Telegram   │     │           AI PROCESSOR              │     │   Structured       │
│   Message        │────▶│                                     │────▶│   Market Event     │
│                  │     │   1. Fetch active watchlist from DB  │     │                    │
│   "Bitcoin hits  │     │      [BTC, ETH, SOL, MON, XAU...]  │     │   headline:        │
│   new ATH as     │     │                                     │     │    "BTC hits ATH"  │
│   institutional  │     │   2. Inject watchlist into system   │     │   sentiment:       │
│   buyers flood   │     │      prompt as context              │     │    "bullish"       │
│   the market"    │     │                                     │     │   confidence: 0.92 │
│                  │     │   3. Call AI API (OpenAI-compatible)│     │   impact_assets:   │
│                  │     │      with temperature=0.3           │     │    [{ticker: "BTC", │
│                  │     │                                     │     │      direction:     │
│                  │     │   4. Parse JSON from response       │     │      "bullish",    │
│                  │     │      (handles ```json``` blocks)    │     │      magnitude:    │
│                  │     │                                     │     │      "high"}]      │
└─────────────────┘     └─────────────────────────────────────┘     └────────────────────┘
```

### AI Output Schema

Every processed message produces a structured JSON object:

```json
{
  "headline": "Bitcoin surges past $100K on institutional demand",
  "summary": "Major institutional players increase BTC holdings...",
  "sentiment": "bullish",
  "confidence": 0.92,
  "impact_assets": [
    {
      "ticker": "BTC",
      "direction": "bullish",
      "magnitude": "high",
      "rationale": "Direct price catalyst from institutional buying",
      "timeframe": "immediate"
    },
    {
      "ticker": "ETH",
      "direction": "bullish",
      "magnitude": "medium",
      "rationale": "Positive spillover from BTC momentum",
      "timeframe": "short_term"
    }
  ],
  "categories": ["crypto", "macro"],
  "tags": ["institutional", "whale", "ath"]
}
```

### AI Services on the Web App

The web app also uses AI for several premium features:

| Service | Function | Used By |
|---------|----------|---------|
| **analyzeText()** | Analyze any user-provided text with market context enrichment (recent events + live prices from CoinGecko) | `/api/analyze` |
| **generateTradingPlan()** | Generate entry/stop-loss/take-profit trading recommendations using OHLC data + intelligence | `/api/ticker/[symbol]/analysis` |
| **summarizeDigest()** | Synthesize multiple events into hourly or daily market digests | `/api/digest/hourly`, `/api/digest/daily` |

---

## 💳 Payment Flow (x402)

**x402** is a decentralized payment protocol that enables HTTP-native micropayments. Every premium API call requires a small USDC payment on the **Monad Testnet**.

### How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│   CLIENT     │     │  KABARCHOG   │     │   x402           │     │   MONAD      │
│  (Browser /  │     │  API SERVER  │     │   FACILITATOR    │     │   TESTNET    │
│   AI Agent)  │     │              │     │                  │     │              │
└──────┬───────┘     └──────┬───────┘     └────────┬─────────┘     └──────┬───────┘
       │                    │                      │                      │
       │  1. GET /api/feed  │                      │                      │
       │───────────────────▶│                      │                      │
       │                    │                      │                      │
       │  2. 402 Payment    │                      │                      │
       │     Required       │                      │                      │
       │     (price, payTo, │                      │                      │
       │      network)      │                      │                      │
       │◀───────────────────│                      │                      │
       │                    │                      │                      │
       │  3. Sign EIP-712   │                      │                      │
       │     typed data     │                      │                      │
       │     with wallet    │                      │                      │
       │  ┌─────────────┐   │                      │                      │
       │  │ MetaMask    │   │                      │                      │
       │  │ Sign Prompt │   │                      │                      │
       │  └─────────────┘   │                      │                      │
       │                    │                      │                      │
       │  4. Retry request  │                      │                      │
       │     with payment   │                      │                      │
       │     header         │                      │                      │
       │───────────────────▶│                      │                      │
       │                    │                      │                      │
       │                    │  5. Verify payment    │                      │
       │                    │─────────────────────▶│                      │
       │                    │                      │                      │
       │                    │                      │  6. Settle on-chain  │
       │                    │                      │─────────────────────▶│
       │                    │                      │                      │
       │                    │  7. Payment OK        │                      │
       │                    │◀─────────────────────│                      │
       │                    │                      │                      │
       │  8. 200 OK         │                      │                      │
       │     + JSON data    │                      │                      │
       │◀───────────────────│                      │                      │
       │                    │                      │                      │
```

### Payment Configuration

| Parameter | Value |
|----------|-------|
| **Network** | Monad Testnet (`eip155:10143`) |
| **Token** | USDC (`0x534b...3A3`) |
| **Facilitator** | `https://x402-facilitator.molandak.org` |
| **Scheme** | `exact` (fixed-price per call) |

### Pricing Table

| Endpoint | Price (USDC) | Description |
|----------|-------------|-------------|
| `GET /api/feed/live` | $0.001 | Latest market events feed |
| `GET /api/feed/ticker/{symbol}` | $0.002 | News for a specific asset |
| `GET /api/digest/hourly` | $0.003 | AI-synthesized hourly summary |
| `GET /api/digest/daily` | $0.005 | AI-synthesized daily outlook |
| `GET /api/ticker/{symbol}/sentiment` | $0.002 | Sentiment distribution stats |
| `GET /api/ticker/{symbol}/analysis` | $0.010 | Full AI trading plan |
| `POST /api/analyze` | $0.005 | Custom text analysis |
| `GET /premium` | $0.001 | Premium content unlock |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** with npm
- **PostgreSQL** database (we use [Neon](https://neon.tech) — free tier works)
- **Telegram API credentials** from [my.telegram.org](https://my.telegram.org)
- **AI API key** (OpenAI-compatible endpoint)
- **EVM wallet** with Monad testnet USDC (for payment features)

### 1. Clone the Repository

```bash
git clone https://github.com/zerodevid/KabarChog.git
cd KabarChog
```

### 2. Set Up the Scraper

```bash
cd scraper

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
```

Edit `scraper/.env` with your credentials:

```env
# Telegram Credentials (from https://my.telegram.org)
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
TELEGRAM_PHONE=+628xxxxxxxxxx

# Database (Neon PostgreSQL connection string)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# AI API (OpenAI-compatible)
AI_API_KEY=sk-your-api-key
AI_BASE_URL=https://api.openai.com/v1/chat/completions

# Optional: Telegram notification bot
NOTIFICATION_BOT_TOKEN=your_bot_token
NOTIFICATION_USER_ID=your_telegram_user_id
```

Initialize the database and seed the watchlist:

```bash
python database.py       # Creates tables (assets, market_events)
python seed_assets.py    # Seeds watchlist (BTC, ETH, SOL, MON, XAU, OIL, etc.)
```

Start the scraper:

```bash
python market_scraper.py
```

> **First Run:** Telethon will prompt you for your Telegram phone number and a verification code. This creates a `.session` file for future use.

### 3. Set Up the Web App

```bash
cd web

# Install dependencies
npm install

# Configure environment
# Create .env.local in the web/ directory
```

Create `web/.env.local`:

```env
# Same Neon Postgres database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Your EVM wallet address to receive payments
PAY_TO_ADDRESS=0xYourWalletAddress

# AI API (same as scraper)
AI_API_KEY=sk-your-api-key
AI_BASE_URL=https://api.openai.com/v1/chat/completions
```

Start the dev server:

```bash
npm run dev
```

Visit **http://localhost:3000** for the landing page and **http://localhost:3000/demo** for the API Explorer.

---

## 📡 API Endpoints

### Free Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/events` | Latest 10 market events (unprotected preview) |
| `GET` | `/api/tickers` | Active watchlist tickers |

### Premium Endpoints (x402)

| Method | Path | Price | Description |
|--------|------|-------|-------------|
| `GET` | `/api/feed/live?limit=20` | $0.001 | Real-time intelligence feed |
| `GET` | `/api/feed/ticker/{symbol}` | $0.002 | Events impacting a specific ticker |
| `GET` | `/api/digest/hourly` | $0.003 | AI-generated hourly market summary |
| `GET` | `/api/digest/daily` | $0.005 | AI-generated daily market outlook |
| `GET` | `/api/ticker/{symbol}/sentiment` | $0.002 | Bullish/bearish sentiment distribution |
| `GET` | `/api/ticker/{symbol}/analysis` | $0.010 | AI trading plan (entry, SL, TP) with OHLC data |
| `POST` | `/api/analyze` | $0.005 | Analyze any custom text for market impact |
| `GET` | `/premium` | $0.001 | Premium content access |

### Example: Calling with x402

```typescript
import { wrapFetchWithPayment } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { x402Client } from "@x402/core/client";

const client = new x402Client().register("eip155:10143", new ExactEvmScheme(signer));
const paymentFetch = wrapFetchWithPayment(fetch, client);

const response = await paymentFetch("https://kabarchog.example.com/api/feed/live?limit=5");
const data = await response.json();
```

---

## 📁 Project Structure

```
KabarChog/
├── scraper/                    # Python Telegram scraper
│   ├── market_scraper.py       # Main scraper: history sync + live monitoring
│   ├── ai_processor.py         # AI analysis engine (OpenAI-compatible API)
│   ├── database.py             # PostgreSQL ORM layer + schema init
│   ├── seed_assets.py          # Seed watchlist (crypto, commodities, macro)
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment template
│
├── web/                        # Next.js web application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page with wallet connect
│   │   │   ├── demo/
│   │   │   │   └── page.tsx    # API Explorer / Playground
│   │   │   ├── premium/
│   │   │   │   └── route.ts    # x402-protected premium content
│   │   │   └── api/
│   │   │       ├── events/route.ts            # Free: latest market events
│   │   │       ├── tickers/route.ts           # Free: active watchlist
│   │   │       ├── analyze/route.ts           # Paid: custom text analysis
│   │   │       ├── feed/
│   │   │       │   ├── live/route.ts          # Paid: real-time feed
│   │   │       │   └── ticker/[symbol]/route.ts # Paid: ticker-specific feed
│   │   │       ├── digest/
│   │   │       │   ├── hourly/route.ts        # Paid: hourly AI digest
│   │   │       │   └── daily/route.ts         # Paid: daily AI digest
│   │   │       └── ticker/[symbol]/
│   │   │           ├── sentiment/route.ts     # Paid: sentiment stats
│   │   │           └── analysis/route.ts      # Paid: AI trading plan
│   │   ├── components/
│   │   │   ├── landing/                       # Landing page components
│   │   │   └── providers.tsx                  # Wagmi + React Query providers
│   │   └── lib/
│   │       ├── db.ts           # PostgreSQL connection pool
│   │       ├── ai.ts           # AI utilities (analyze, trading plan, digest)
│   │       └── x402.ts         # x402 payment configuration & middleware
│   ├── package.json
│   └── .env.local              # Environment variables (not committed)
│
├── .gitignore
└── README.md
```

---

## 🗄 Database Schema

### `assets` — Watchlist

```sql
CREATE TABLE assets (
    ticker      VARCHAR(20) PRIMARY KEY,
    name        VARCHAR(100),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Default tickers:** `BTC`, `ETH`, `SOL`, `MON`, `XAU`, `XAG`, `OIL`, `DXY`, `SPX`, `NDX`, `US10Y`

### `market_events` — Intelligence Data

```sql
CREATE TABLE market_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tg_msg_id       BIGINT,
    channel_handle  VARCHAR(100),
    event_time      TIMESTAMP,
    headline        VARCHAR(255),
    summary         TEXT,
    sentiment       VARCHAR(20),      -- 'bullish' | 'bearish' | 'neutral'
    confidence      FLOAT,            -- 0.0 to 1.0
    impact_assets   JSONB,            -- Array of impacted assets with direction
    categories      TEXT[],           -- ['crypto', 'macro', 'regulatory', ...]
    tags            TEXT[],           -- ['fed', 'whale', 'etf', ...]
    raw_text        TEXT,
    UNIQUE(tg_msg_id, channel_handle) -- Deduplication key
);
```

---

## 🔐 Security Notes

- **Never commit `.env` files** — all secrets are in `.gitignore`
- **Telegram session files** (`.session`) contain auth credentials — also gitignored
- **x402 payments** are verified server-side via the facilitator before data is returned
- **Database** uses SSL (`sslmode=require`) for all connections
- **AI API keys** are server-side only — never exposed to the browser

---

## 📜 License

MIT

---

<p align="center">
  <sub>Built with ☕ by <a href="https://github.com/zerodevid">zerodevid</a></sub>
</p>