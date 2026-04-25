import { NextResponse, NextRequest } from "next/server";
import { withX402, server, createRouteConfig } from "@/lib/x402";

async function handler(request: NextRequest): Promise<NextResponse> {
    return NextResponse.json({
        content: "Return premium content",
        unlockedAt: new Date().toISOString(),
    });
}

export const GET = withX402(handler, createRouteConfig("/premium"), server);
