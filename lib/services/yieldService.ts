import { Opportunity } from "../mockData";

const DEFILLAMA_YIELD_API = "https://yields.llama.fi/pools";

// Whitelist of safe/popular protocols on Base
const SAFE_PROTOCOLS = ["Aave V3", "Moonwell", "Aerodrome", "Morpho", "Aerodrome Slipstream", "Uniswap V3"];

export const yieldService = {
    fetchYieldOpportunities: async (): Promise<Opportunity[]> => {
        try {
            console.log("DEBUG: Fetching yield data from DefiLlama...");
            const response = await fetch(DEFILLAMA_YIELD_API);

            if (!response.ok) {
                throw new Error(`DefiLlama API Error: ${response.status}`);
            }

            const json = await response.json();

            // Filter pools
            const basePools = json.data.filter((p: any) =>
                p.chain === "Base" &&
                SAFE_PROTOCOLS.some(proto => p.project.toLowerCase().includes(proto.toLowerCase())) &&
                p.tvlUsd > 1000000 && // Min $1M TVL for safety
                p.apy > 0 // Positive yield
            );

            // Sort by APY descending, but maybe limit extremely high risk ones? 
            // For now just sort by TVL to show most popular/safe ones first
            basePools.sort((a: any, b: any) => b.tvlUsd - a.tvlUsd);

            // Take top 10 and map to Opportunity interface
            const opportunities: Opportunity[] = basePools.slice(0, 10).map((p: any, index: number) => ({
                id: `passive-live-${index}`,
                type: "passive",
                protocol: formatProtocolName(p.project),
                protocolIcon: getProtocolIcon(p.project),
                asset: p.symbol,
                apy: Number(p.apy.toFixed(2)),
                description: `Earn ${p.apy.toFixed(2)}% APY on ${p.symbol} via ${formatProtocolName(p.project)}. TVL: $${(p.tvlUsd / 1000000).toFixed(1)}M`,
                tvl: `$${(p.tvlUsd / 1000000).toFixed(1)}M`
            }));

            console.log(`DEBUG: Found ${opportunities.length} active yield opportunities.`);
            return opportunities;
        } catch (error) {
            console.error("Failed to fetch yield opportunities:", error);
            // Fallback to empty or specific error state, 
            // but for now we will return empty array and let the UI handle it (or simulation fallback logic in page)
            return [];
        }
    }
};

function formatProtocolName(project: string): string {
    if (project.includes("aave")) return "Aave V3";
    if (project.includes("moonwell")) return "Moonwell";
    if (project.includes("aerodrome")) return "Aerodrome";
    if (project.includes("morpho")) return "Morpho";
    if (project.includes("uniswap")) return "Uniswap";
    return project.charAt(0).toUpperCase() + project.slice(1);
}

function getProtocolIcon(project: string): string {
    if (project.includes("aave")) return "👻";
    if (project.includes("moonwell")) return "🌑";
    if (project.includes("aerodrome")) return "✈️";
    if (project.includes("morpho")) return "🦋";
    if (project.includes("uniswap")) return "🦄";
    return "💰";
}
