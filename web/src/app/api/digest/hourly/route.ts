import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { withX402, server, createRouteConfig } from "@/lib/x402";
import { summarizeDigest } from "@/lib/ai";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const events = await query(
            "SELECT headline, summary, sentiment FROM market_events WHERE event_time > now() - interval '1 hour' ORDER BY event_time DESC"
        );
        
        if (events.rows.length === 0) {
            return NextResponse.json({ message: "No events in this period" });
        }

        // Data exists, require payment
        const config = createRouteConfig("/api/digest/hourly", "$0.003");
        const protectedHandler = withX402(async () => {
            const digest = await summarizeDigest(events.rows, 'hourly');
            return NextResponse.json(digest);
        }, config, server);

        return protectedHandler(request);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
