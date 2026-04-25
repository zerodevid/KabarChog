import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { withX402, server, createRouteConfig } from "@/lib/x402";
import { generateTradingPlan } from "@/lib/ai";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const ticker = request.nextUrl.pathname.split('/').slice(-2, -1)[0]?.toUpperCase();
    if (!ticker) return NextResponse.json({ error: "Ticker required" }, { status: 400 });

    const assetRes = await query('SELECT coingecko_id FROM assets WHERE ticker = $1', [ticker]);
    const cgId = assetRes.rows[0]?.coingecko_id;
    if (!cgId) return NextResponse.json({ error: `Ticker ${ticker} not mapped in database` }, { status: 400 });

    try {
        // 1. Fetch DB Intelligence (Free Pre-check)
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
            return NextResponse.json({ message: "No news intelligence available for this ticker yet." });
        }

        // 2. Fetch CoinGecko OHLC (Free Pre-check)
        // We do this BEFORE payment to ensure we have data before charging the user
        const cgRes = await fetch(`https://api.coingecko.com/api/v3/coins/${cgId}/ohlc?vs_currency=usd&days=1`, {
            headers: { "User-Agent": "KabarChog/1.0" },
            next: { revalidate: 300 }
        });

        if (!cgRes.ok) {
            return NextResponse.json({ error: "Market data provider (CoinGecko) is currently unavailable. Please try again later." }, { status: 503 });
        }
        const ohlc = await cgRes.json();

        // 3. Everything is ready, NOW require payment
        const config = createRouteConfig("/api/ticker/[symbol]/analysis", "$0.01");
        const protectedHandler = withX402(async () => {
            // Generate plan using pre-fetched data
            const analysis = await generateTradingPlan(ticker, ohlc, intel.rows);
            return NextResponse.json({
                ticker,
                ohlc_data_last_24h: ohlc.slice(-1),
                ...analysis
            });
        }, config, server);

        return protectedHandler(request);
    } catch (error: any) {
        console.error("Analysis API Error:", error);
        return NextResponse.json({ error: "An internal error occurred while generating analysis." }, { status: 500 });
    }
}
