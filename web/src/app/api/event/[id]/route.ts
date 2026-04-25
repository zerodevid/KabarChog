import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { withX402, server, createRouteConfig } from "@/lib/x402";

async function handler(request: NextRequest): Promise<NextResponse> {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        const result = await query('SELECT * FROM market_events WHERE id = $1', [id]);
        if (result.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const GET = withX402(handler, createRouteConfig("/api/event/[id]", "$0.002"), server);
