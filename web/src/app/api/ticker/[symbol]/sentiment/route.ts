import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { withX402, server, createRouteConfig } from "@/lib/x402";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const symbol = request.nextUrl.pathname.split('/').slice(-2, -1)[0]?.toUpperCase();
    if (!symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 });

    try {
        const result = await query(
            `SELECT sentiment, count(*) as count
             FROM market_events, jsonb_array_elements(impact_assets) as asset 
             WHERE asset->>'ticker' = $1
             GROUP BY sentiment`,
            [symbol]
        );
        
        if (result.rows.length === 0) {
            return NextResponse.json({ ticker: symbol, total_events: 0, distribution: [] });
        }

        const config = createRouteConfig("/api/ticker/[symbol]/sentiment", "$0.002");
        const protectedHandler = withX402(async () => {
            const total = result.rows.reduce((acc, row) => acc + parseInt(row.count), 0);
            const distribution = result.rows.map(row => ({
                sentiment: row.sentiment,
                count: parseInt(row.count),
                weight: (parseInt(row.count) / (total || 1)).toFixed(2)
            }));

            return NextResponse.json({
                ticker: symbol,
                total_events: total,
                distribution
            });
        }, config, server);

        return protectedHandler(request);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
