import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { withX402, server, createRouteConfig } from "@/lib/x402";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const symbol = request.nextUrl.pathname.split('/').pop()?.toUpperCase();
    if (!symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 });
    
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
            return NextResponse.json([]);
        }

        const config = createRouteConfig("/api/feed/ticker/[symbol]", "$0.002");
        const protectedHandler = withX402(async () => {
            return NextResponse.json(result.rows);
        }, config, server);

        return protectedHandler(request);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
