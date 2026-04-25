import 'dotenv/config';
import express from 'express';
import { query } from './lib/db.js';
import { analyzeText, generateTradingPlan, summarizeDigest, SYMBOL_MAP } from './lib/ai.js';
import { server, MONAD_NETWORK, createPaymentRequirements, PAY_TO } from './lib/x402.js';
import { x402HTTPResourceServer } from '@x402/core/server';

const app = express();
app.use(express.json());

// ============================================================
// x402 Middleware — Validates payment headers on protected routes
// ============================================================
const PROTECTED_ROUTES: Record<string, { price: string }> = {
  '/api/feed/live': { price: '$0.001' },
  '/api/feed/ticker/:symbol': { price: '$0.002' },
  '/api/digest/hourly': { price: '$0.003' },
  '/api/digest/daily': { price: '$0.005' },
  '/api/ticker/:symbol/sentiment': { price: '$0.002' },
  '/api/ticker/:symbol/analysis': { price: '$0.01' },
  '/api/analyze': { price: '$0.005' },
};

// Build x402 route config
function buildRoutesConfig() {
  const routes: Record<string, any> = {};
  for (const [path, config] of Object.entries(PROTECTED_ROUTES)) {
    routes[path] = {
      accepts: {
        scheme: "exact",
        network: MONAD_NETWORK,
        payTo: PAY_TO || "0x0000000000000000000000000000000000000000",
        price: config.price,
      },
      resource: path,
    };
  }
  return routes;
}

// Initialize HTTP resource server for x402
let httpResourceServer: any = null;
try {
  if (PAY_TO) {
    const routesConfig = buildRoutesConfig();
    httpResourceServer = new x402HTTPResourceServer(server, routesConfig);
    httpResourceServer.initialize().catch((err: any) => {
      console.warn('⚠️  x402 facilitator init failed (demo mode active):', err.message);
      httpResourceServer = null;
    });
    console.log('🔐 x402 payment verification ENABLED');
  } else {
    console.log('🔓 x402 payment verification DISABLED (demo mode — no PAY_TO_ADDRESS)');
  }
} catch (err: any) {
  console.warn('⚠️  x402 setup failed:', err.message);
}

// Express adapter for x402
class ExpressAdapter {
  constructor(private req: express.Request) {}
  getHeader(name: string) { return this.req.headers[name.toLowerCase()] as string | undefined; }
  getMethod() { return this.req.method; }
  getPath() { return this.req.path; }
  getUrl() { return `${this.req.protocol}://${this.req.get('host')}${this.req.originalUrl}`; }
  getAcceptHeader() { return this.req.headers['accept'] || ''; }
  getUserAgent() { return this.req.headers['user-agent'] || ''; }
  getQueryParams() { return this.req.query as Record<string, string>; }
  getQueryParam(name: string) { return this.req.query[name] as string | undefined; }
  async getBody() { return this.req.body; }
}

// x402 middleware
async function x402Middleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  // If no payment server configured, skip payment verification (demo mode)
  if (!httpResourceServer) {
    return next();
  }

  // Check if this route requires payment
  const matchedRoute = req.route?.path;
  if (!matchedRoute || !PROTECTED_ROUTES[matchedRoute]) {
    return next();
  }

  try {
    const adapter = new ExpressAdapter(req);
    const context = {
      adapter,
      path: req.path,
      method: req.method,
      paymentHeader: adapter.getHeader('payment-signature') || adapter.getHeader('x-payment'),
    };

    const result = await httpResourceServer.processHTTPRequest(context);

    switch (result.type) {
      case 'no-payment-required':
        return next();

      case 'payment-error': {
        const headers = result.response.headers || {};
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value as string);
        });
        res.status(result.response.status);
        if (result.response.isHtml) {
          return res.send(result.response.body);
        }
        return res.json(result.response.body || {});
      }

      case 'payment-verified':
        // Store payment info for settlement after response
        (req as any)._x402 = {
          paymentPayload: result.paymentPayload,
          paymentRequirements: result.paymentRequirements,
          declaredExtensions: result.declaredExtensions,
        };
        return next();
    }
  } catch (err: any) {
    console.error('x402 middleware error:', err);
    return next();
  }
}

// ============================================================
// API Routes
// ============================================================

// --- GET /api/tickers (Free - no payment required) ---
app.get('/api/tickers', async (_req, res) => {
  try {
    const result = await query(
      'SELECT ticker FROM assets WHERE is_active = TRUE ORDER BY ticker ASC'
    );
    res.json(result.rows.map((r: any) => r.ticker));
  } catch (error: any) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- GET /api/events (Free - no payment required) ---
app.get('/api/events', async (_req, res) => {
  try {
    const result = await query(
      'SELECT * FROM market_events ORDER BY event_time DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- GET /api/feed/live (x402 protected) ---
app.get('/api/feed/live', x402Middleware, async (req, res) => {
  const limit = req.query.limit || '20';

  try {
    const result = await query(
      'SELECT * FROM market_events ORDER BY event_time DESC LIMIT $1',
      [parseInt(limit as string)]
    );

    if (result.rows.length === 0) {
      return res.json([]);
    }

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- GET /api/feed/ticker/:symbol (x402 protected) ---
app.get('/api/feed/ticker/:symbol', x402Middleware, async (req, res) => {
  const symbol = req.params.symbol?.toUpperCase();
  if (!symbol) return res.status(400).json({ error: "Symbol required" });

  try {
    const result = await query(
      `SELECT * FROM market_events 
       WHERE id IN (
          SELECT id FROM market_events, jsonb_array_elements(impact_assets) as asset 
          WHERE asset->>'ticker' = $1
       )
       ORDER BY event_time DESC LIMIT 50`,
      [symbol]
    );

    if (result.rows.length === 0) {
      return res.json([]);
    }

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- GET /api/digest/hourly (x402 protected) ---
app.get('/api/digest/hourly', x402Middleware, async (_req, res) => {
  try {
    const events = await query(
      "SELECT headline, summary, sentiment FROM market_events WHERE event_time > now() - interval '1 hour' ORDER BY event_time DESC"
    );

    if (events.rows.length === 0) {
      return res.json({ message: "No events in this period" });
    }

    const digest = await summarizeDigest(events.rows, 'hourly');
    res.json(digest);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- GET /api/digest/daily (x402 protected) ---
app.get('/api/digest/daily', x402Middleware, async (_req, res) => {
  try {
    const events = await query(
      "SELECT headline, summary, sentiment FROM market_events WHERE event_time > now() - interval '24 hours' ORDER BY event_time DESC"
    );

    if (events.rows.length === 0) {
      return res.json({ message: "No events in this period" });
    }

    const digest = await summarizeDigest(events.rows, 'daily');
    res.json(digest);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- GET /api/ticker/:symbol/sentiment (x402 protected) ---
app.get('/api/ticker/:symbol/sentiment', x402Middleware, async (req, res) => {
  const symbol = req.params.symbol?.toUpperCase();
  if (!symbol) return res.status(400).json({ error: "Symbol required" });

  try {
    const result = await query(
      `SELECT sentiment, count(*) as count
       FROM market_events, jsonb_array_elements(impact_assets) as asset 
       WHERE asset->>'ticker' = $1
       GROUP BY sentiment`,
      [symbol]
    );

    if (result.rows.length === 0) {
      return res.json({ ticker: symbol, total_events: 0, distribution: [] });
    }

    const total = result.rows.reduce((acc: number, row: any) => acc + parseInt(row.count), 0);
    const distribution = result.rows.map((row: any) => ({
      sentiment: row.sentiment,
      count: parseInt(row.count),
      weight: (parseInt(row.count) / (total || 1)).toFixed(2)
    }));

    res.json({
      ticker: symbol,
      total_events: total,
      distribution
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- GET /api/ticker/:symbol/analysis (x402 protected) ---
app.get('/api/ticker/:symbol/analysis', x402Middleware, async (req, res) => {
  const ticker = req.params.symbol?.toUpperCase();
  if (!ticker) return res.status(400).json({ error: "Ticker required" });

  const cgId = SYMBOL_MAP[ticker];
  if (!cgId) return res.status(400).json({ error: `Ticker ${ticker} not mapped` });

  try {
    // 1. Fetch DB Intelligence
    const intel = await query(
      `SELECT headline, summary, sentiment FROM market_events 
       WHERE id IN (
          SELECT id FROM market_events, jsonb_array_elements(impact_assets) as asset 
          WHERE asset->>'ticker' = $1
       )
       ORDER BY event_time DESC LIMIT 5`,
      [ticker]
    );

    if (intel.rows.length === 0) {
      return res.json({ message: "No news intelligence available for this ticker yet." });
    }

    // 2. Fetch CoinGecko OHLC
    const cgRes = await fetch(`https://api.coingecko.com/api/v3/coins/${cgId}/ohlc?vs_currency=usd&days=1`, {
      headers: { "User-Agent": "KabarChog/1.0" },
    });

    if (!cgRes.ok) {
      return res.status(503).json({ error: "Market data provider (CoinGecko) is currently unavailable. Please try again later." });
    }
    const ohlc = await cgRes.json();

    // 3. Generate AI trading plan
    const analysis = await generateTradingPlan(ticker, ohlc, intel.rows);
    res.json({
      ticker,
      ohlc_data_last_24h: ohlc.slice(-1),
      ...analysis
    });
  } catch (error: any) {
    console.error("Analysis API Error:", error);
    res.status(500).json({ error: "An internal error occurred while generating analysis." });
  }
});

// --- POST /api/analyze (x402 protected) ---
const MARKET_KEYWORDS = [
  'bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol', 'monad', 'crypto',
  'market', 'price', 'bull', 'bear', 'pump', 'dump', 'whale', 'trading',
  'fed', 'rate', 'inflation', 'gdp', 'cpi', 'fomc', 'treasury',
  'gold', 'oil', 'commodity', 'stock', 'nasdaq', 'sp500', 's&p',
  'etf', 'sec', 'regulation', 'defi', 'nft', 'stablecoin',
  'rally', 'crash', 'dip', 'resistance', 'support', 'breakout',
  'halving', 'mining', 'hash', 'liquidity', 'volume',
];

function isMarketRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return MARKET_KEYWORDS.some(kw => lower.includes(kw));
}

function extractTickers(text: string, knownTickers: string[]): string[] {
  const upper = text.toUpperCase();
  return knownTickers.filter(t => upper.includes(t));
}

app.post('/api/analyze', x402Middleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    let marketContext: { recentEvents: any[], prices?: any } | undefined;

    // If the text is market-related, enrich with real data
    if (isMarketRelated(text)) {
      let eventsResult = await query(
        `SELECT headline, summary, sentiment, confidence 
         FROM market_events 
         WHERE event_time > now() - interval '24 hours'
         ORDER BY event_time DESC LIMIT 10`
      );

      if (eventsResult.rows.length === 0) {
        eventsResult = await query(
          `SELECT headline, summary, sentiment, confidence 
           FROM market_events 
           ORDER BY event_time DESC LIMIT 10`
        );
      }

      const mentionedTickers = extractTickers(text, Object.keys(SYMBOL_MAP));
      let prices: any = null;

      if (mentionedTickers.length > 0) {
        try {
          const cgIds = mentionedTickers
            .map(t => SYMBOL_MAP[t])
            .filter(Boolean)
            .join(',');

          if (cgIds) {
            const priceRes = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=usd&include_24hr_change=true`,
              { headers: { "User-Agent": "KabarChog/1.0" } }
            );
            if (priceRes.ok) {
              prices = await priceRes.json();
            }
          }
        } catch (e) {
          console.warn("Price fetch failed (non-critical):", e);
        }
      }

      marketContext = {
        recentEvents: eventsResult.rows,
        prices: prices,
      };
    }

    const analysis = await analyzeText(text, marketContext);
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// Start Server
// ============================================================
const PORT = parseInt(process.env.API_PORT || '3001');

app.listen(PORT, () => {
  console.log(`\n🚀 KabarChog API Server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   GET  /api/tickers                  (free)`);
  console.log(`   GET  /api/events                   (free)`);
  console.log(`   GET  /api/feed/live                 ($0.001)`);
  console.log(`   GET  /api/feed/ticker/:symbol       ($0.002)`);
  console.log(`   GET  /api/digest/hourly             ($0.003)`);
  console.log(`   GET  /api/digest/daily              ($0.005)`);
  console.log(`   GET  /api/ticker/:symbol/sentiment  ($0.002)`);
  console.log(`   GET  /api/ticker/:symbol/analysis   ($0.01)`);
  console.log(`   POST /api/analyze                   ($0.005)`);
  console.log('');
});
