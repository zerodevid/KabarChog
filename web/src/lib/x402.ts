import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { withX402, type RouteConfig } from "@x402/next";
import type { Network } from "@x402/core/types";

// Monad Testnet configuration
export const MONAD_NETWORK: Network = "eip155:10143";
export const MONAD_USDC_TESTNET = "0x534b2f3A21130d7a60830c2Df862319e593943A3";
export const FACILITATOR_URL = "https://x402-facilitator.molandak.org";

const PAY_TO = process.env.PAY_TO_ADDRESS;
if (!PAY_TO) {
    throw new Error("PAY_TO_ADDRESS environment variable is required");
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

// Helper to create route config
export function createRouteConfig(resource: string, price: string = "$0.001"): RouteConfig {
    return {
        accepts: {
            scheme: "exact",
            network: MONAD_NETWORK,
            payTo: PAY_TO!,
            price: price,
        },
        resource: resource,
    };
}

export { withX402 };
