const API_KEY = process.env.AI_API_KEY;
const API_URL = process.env.AI_BASE_URL;

export const SYMBOL_MAP: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'MONAD': 'monad', // Placeholder if exists
};

const SYSTEM_PROMPT = `You are a professional crypto market analyst. 
Analyze the provided information and determine its market impact.

Output ONLY a JSON object following this schema:
{
  "headline": "string (max 100 char)",
  "summary": "string (max 300 char)",
  "sentiment": "bullish | bearish | neutral",
  "confidence": 0.0-1.0,
  "impact_assets": [
    {
      "ticker": "string",
      "direction": "bullish | bearish",
      "rationale": "string"
    }
  ],
  "categories": ["macro", "crypto", "commodities", "geopolitics", "regulatory"],
  "tags": ["fed", "rate_hike", "etc"]
}`;

const TRADING_PLAN_PROMPT = `You are an expert crypto trader. 
Analyze the provided OHLC data and recent Market Intelligence. 
Develop a concise trading plan.

Output ONLY a JSON object:
{
  "technical_context": "string (brief trend analysis)",
  "fundamental_context": "string (brief news impact)",
  "trading_plan": {
    "action": "long | short | wait",
    "entry": "string",
    "stop_loss": "string",
    "take_profit": "string",
    "rationale": "string"
  },
  "risk_level": "low | medium | high"
}`;

async function callAI(messages: any[]) {
  if (!API_KEY || !API_URL) throw new Error("AI credentials missing");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.4",
      messages: messages,
      temperature: 0.3,
    }),
  });

  if (!response.ok) throw new Error(`AI API failed: ${response.statusText}`);
  
  const result = await response.json();
  let content = result.choices[0].message.content;

  // Clean JSON from markdown
  if (content.includes("```json")) {
    content = content.split("```json")[1].split("```")[0].trim();
  } else if (content.includes("```")) {
    content = content.split("```")[1].split("```")[0].trim();
  }

  return JSON.parse(content);
}

export async function analyzeText(text: string, marketContext?: { recentEvents: any[], prices?: any }) {
  let userContent = text;

  if (marketContext) {
    const parts: string[] = [`USER TEXT TO ANALYZE:\n${text}`];

    if (marketContext.recentEvents.length > 0) {
      const eventsStr = marketContext.recentEvents
        .map((e: any) => `• [${e.sentiment}] ${e.headline}: ${e.summary}`)
        .join('\n');
      parts.push(`RECENT MARKET INTELLIGENCE (use as context for more accurate analysis):\n${eventsStr}`);
    }

    if (marketContext.prices) {
      parts.push(`CURRENT LIVE PRICES:\n${JSON.stringify(marketContext.prices)}`);
    }

    // Only enrich if we actually have extra context
    if (parts.length > 1) {
      userContent = parts.join('\n\n');
    }
  }

  return callAI([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userContent }
  ]);
}

export async function generateTradingPlan(symbol: string, ohlc: any[], intelligence: any[]) {
  const ohlcStr = JSON.stringify(ohlc.slice(-10)); // Last 10 periods
  const intelStr = JSON.stringify(intelligence);

  return callAI([
    { role: "system", content: TRADING_PLAN_PROMPT },
    { role: "user", content: `Ticker: ${symbol}\nOHLC Data: ${ohlcStr}\nMarket Intelligence: ${intelStr}` }
  ]);
}

export async function summarizeDigest(events: any[], type: 'hourly' | 'daily') {
  const prompt = `Synthesize the following ${type} market events into a cohesive digest.\n\nEvents: ${JSON.stringify(events)}`;
  return callAI([
    { role: "system", content: "You are a lead market editor." },
    { role: "user", content: prompt }
  ]);
}
