import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { withX402, server, createRouteConfig } from "@/lib/x402";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    
    try {
        const result = await query(
            'SELECT * FROM market_events ORDER BY event_time DESC LIMIT $1',
            [parseInt(limit)]
        );

        // CONDITIONAL PAYMENT: Only charge if data exists
        if (result.rows.length === 0) {
            return NextResponse.json([]);
        }

        // Data exists, use x402 protection
        const config = createRouteConfig("/api/feed/live");
        const protectedHandler = withX402(async () => {
            return NextResponse.json(result.rows);
        }, config, server);

        return protectedHandler(request);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
