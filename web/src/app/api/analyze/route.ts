import { NextRequest, NextResponse } from "next/server";
import { withX402, server, createRouteConfig } from "@/lib/x402";
import { analyzeText, SYMBOL_MAP } from "@/lib/ai";
import { query } from "@/lib/db";

// Keywords that indicate the text is market/finance related
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

// Extract mentioned tickers from text
function extractTickers(text: string, knownTickers: string[]): string[] {
    const upper = text.toUpperCase();
    return knownTickers.filter(t => upper.includes(t));
}

async function handler(request: NextRequest): Promise<NextResponse> {
    try {
        const { text } = await request.json();
        if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

        let marketContext: { recentEvents: any[], prices?: any } | undefined;

        // If the text is market-related, enrich with real data
        if (isMarketRelated(text)) {
            // 1. Fetch recent market events from DB (try 24h first, fallback to 7 days)
            let eventsResult = await query(
                `SELECT headline, summary, sentiment, confidence 
                 FROM market_events 
                 WHERE event_time > now() - interval '24 hours'
                 ORDER BY event_time DESC LIMIT 10`
            );

            // Fallback: if no events in last 24h, try last 7 days
            if (eventsResult.rows.length === 0) {
                eventsResult = await query(
                    `SELECT headline, summary, sentiment, confidence 
                     FROM market_events 
                     ORDER BY event_time DESC LIMIT 10`
                );
            }

            // 2. Try to fetch live prices for mentioned tickers
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
                            {
                                headers: { "User-Agent": "KabarChog/1.0" },
                                next: { revalidate: 60 },
                            }
                        );
                        if (priceRes.ok) {
                            prices = await priceRes.json();
                        }
                    }
                } catch (e) {
                    // Price fetch is best-effort, don't fail the whole request
                    console.warn("Price fetch failed (non-critical):", e);
                }
            }

            marketContext = {
                recentEvents: eventsResult.rows,
                prices: prices,
            };
        }

        const analysis = await analyzeText(text, marketContext);
        return NextResponse.json(analysis);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const POST = withX402(handler, createRouteConfig("/api/analyze", "$0.005"), server);
