import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import type { Network } from "@x402/core/types";

// Monad Testnet configuration
export const MONAD_NETWORK: Network = "eip155:10143";
export const MONAD_USDC_TESTNET = "0x534b2f3A21130d7a60830c2Df862319e593943A3";
export const FACILITATOR_URL = "https://x402-facilitator.molandak.org";

const PAY_TO = process.env.PAY_TO_ADDRESS;
if (!PAY_TO) {
    console.warn("⚠️  PAY_TO_ADDRESS not set — x402 payment verification will be disabled (demo mode)");
}

// Create facilitator client
const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });

// Create resource server
export const server = new x402ResourceServer(facilitatorClient);

// Configure Exact EVM Scheme
const monadScheme = new ExactEvmScheme();
monadScheme.registerMoneyParser(async (amount: number, network: string) => {
    if (network === MONAD_NETWORK) {
        const tokenAmount = Math.floor(amount * 1_000_000).toString();
        return {
            amount: tokenAmount,
            asset: MONAD_USDC_TESTNET,
            extra: { name: "USDC", version: "2" },
        };
    }
    return null;
});

server.register(MONAD_NETWORK, monadScheme);

// Route price configuration
export const ROUTE_PRICES: Record<string, string> = {
    "/api/feed/live": "$0.001",
    "/api/feed/ticker/:symbol": "$0.002",
    "/api/digest/hourly": "$0.003",
    "/api/digest/daily": "$0.005",
    "/api/ticker/:symbol/sentiment": "$0.002",
    "/api/ticker/:symbol/analysis": "$0.01",
    "/api/analyze": "$0.005",
};

// Helper to create payment requirements for x402  
export function createPaymentRequirements(resource: string, price?: string) {
    const finalPrice = price || ROUTE_PRICES[resource] || "$0.001";

    return {
        scheme: "exact" as const,
        network: MONAD_NETWORK,
        payTo: PAY_TO || "0x0000000000000000000000000000000000000000",
        price: finalPrice,
        resource: resource,
    };
}

export { PAY_TO };
