import { Opportunity, OPPORTUNITIES, SocialSignal } from "../mockData";
import { TRACKED_TOKENS } from "../constants";
import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price?ids=aerodrome-finance,degen-base,brett,toshi-the-cat&vs_currencies=usd&include_24hr_change=true";

// Initialize Viem Client for Base
const publicClient = createPublicClient({
    chain: base,
    transport: http()
});

/**
 * Service to handle fetching of investment opportunities and social signals.
 * Now supports Neynar API + Onchain Verification via Viem.
 */
export const socialAlphaService = {
    /**
     * Fetches the latest opportunities with their social signals and prices.
     */
    fetchOpportunities: async (): Promise<Opportunity[]> => {
        // 1. Check for API Key
        // Note: User will now use NEXT_PUBLIC_NEYNAR_API_KEY
        const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || process.env.NEXT_PUBLIC_AIRSTACK_API_KEY;
        const shouldUseRealData = !!apiKey && apiKey !== "";

        console.log("DEBUG: Fetching opportunities. Real Data Mode:", shouldUseRealData);
        if (apiKey) console.log("DEBUG: API Key detected (first 4 chars):", apiKey.substring(0, 4));

        // 2. Fetch Base Opportunities (Mock)
        let opportunities = [...OPPORTUNITIES];

        // 3. Fetch Prices (Onchain Data)
        try {
            const priceRes = await fetch(COINGECKO_API);
            if (priceRes.ok) {
                const priceData = await priceRes.json();

                // Map prices to opportunities
                opportunities = opportunities.map(opp => {
                    let tokenKey = "";
                    if (opp.protocol.includes("Aerodrome")) tokenKey = "aerodrome-finance";
                    if (opp.protocol.includes("Degen")) tokenKey = "degen-base";
                    if (opp.protocol.includes("Brett")) tokenKey = "brett";
                    if (opp.protocol.includes("Toshi")) tokenKey = "toshi-the-cat";
                    if (opp.protocol.includes("Mog")) tokenKey = "mog-coin";
                    if (opp.protocol.includes("Virtual")) tokenKey = "virtual-protocol";
                    if (opp.protocol.includes("Prime")) tokenKey = "echelon-prime";
                    if (opp.protocol.includes("Higher")) tokenKey = "higher";
                    if (opp.protocol.includes("Keyboard")) tokenKey = "keyboard-cat";
                    if (opp.protocol.includes("Base God")) tokenKey = "base-god";

                    if (tokenKey && priceData[tokenKey]) {
                        return {
                            ...opp,
                            price: `$${priceData[tokenKey].usd}`,
                            change24h: `${priceData[tokenKey].usd_24h_change.toFixed(2)}%`
                        };
                    }
                    return opp;
                });
            }
        } catch (e) {
            console.warn("Price fetch failed", e);
        }

        // 4. Enrich with Social Signals
        if (shouldUseRealData) {
            try {
                opportunities = await Promise.all(
                    opportunities.map(async (opp) => {
                        if (opp.type === "alpha") {
                            const tracker = TRACKED_TOKENS.find(t => opp.protocol.includes(t.name)) || TRACKED_TOKENS[0];

                            // Strategy: Search Neynar -> Verify Balance with Viem
                            const signals = await fetchNeynarVerifiedSignals(
                                tracker.symbol,
                                tracker.address,
                                tracker.threshold,
                                apiKey
                            );

                            // Only update if we found valid signals
                            if (signals.length > 0) {
                                return { ...opp, socialSignals: signals };
                            }
                        }
                        return opp;
                    })
                );
            } catch (error) {
                console.error("Failed to fetch real social signals, falling back to simulation:", error);
            }
        } else {
            // SMART SIMULATION: Generate random realistic data
            await new Promise((resolve) => setTimeout(resolve, 800)); // Network delay feel

            opportunities = opportunities.map(opp => {
                if (opp.type === "alpha") {
                    // Pick 3 random signals from our "Super Mock" list
                    const shuffled = [...MOCK_CASTS].sort(() => 0.5 - Math.random());
                    const selectedSignals = shuffled.slice(0, 3).map(s => ({
                        ...s,
                        // Add randomness to time
                        timeAgo: `${Math.floor(Math.random() * 5) + 1}h ago`
                    }));

                    return { ...opp, socialSignals: selectedSignals };
                }
                return opp;
            });
        }

        return opportunities;
    }
};

// --- LOGIC: Neynar Search + Viem Verify ---

const ERC20_ABI = parseAbi([
    'function balanceOf(address owner) view returns (uint256)'
]);

async function fetchNeynarVerifiedSignals(symbol: string, tokenAddress: string, minBalance: number, apiKey: string): Promise<SocialSignal[]> {
    try {
        console.log(`DEBUG: Searching Neynar for ${symbol}...`);
        // Step 1: Search Casts via Neynar
        const searchUrl = `https://api.neynar.com/v2/farcaster/cast/search?q=${symbol}&limit=15`;
        const response = await fetch(searchUrl, {
            headers: {
                "accept": "application/json",
                "api_key": apiKey
            }
        });

        if (!response.ok) {
            console.error(`DEBUG: Neynar API Error ${response.status}: ${response.statusText}`);
            return [];
        }

        const json = await response.json();
        const casts = json.result?.casts || [];
        console.log(`DEBUG: Found ${casts.length} casts for ${symbol}`);

        // Step 2: Verify Balances (Parallel)
        const verifiedSignals: SocialSignal[] = [];

        await Promise.all(casts.map(async (cast: any) => {
            // Optimize: Limit verification to max 3 valid items to save RPC calls
            if (verifiedSignals.length >= 3) return;

            const userAddress = cast.author?.verifications ? cast.author.verifications[0] : null;

            // If user has no connected verified address, skip
            if (!userAddress) return;

            try {
                // Check Balance on Base
                const balance = await publicClient.readContract({
                    address: tokenAddress as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: 'balanceOf',
                    args: [userAddress as `0x${string}`]
                });

                // Convert Wei (assuming 18 decimals roughly for check)
                // AERO/DEGEN are 18 decimals.
                const readableBalance = Number(balance) / 10 ** 18;

                if (readableBalance >= minBalance) {
                    console.log(`DEBUG: Verified user ${cast.author.username} holds ${readableBalance} ${symbol}`);
                    verifiedSignals.push({
                        username: cast.author.username,
                        avatar: cast.author.pfp_url,
                        action: `posted about $${symbol} (Holds ${readableBalance.toFixed(0)} ${symbol})`,
                        timeAgo: timeAgo(new Date(cast.timestamp)),
                    });
                }
            } catch (err) {
                // Ignore RPC errors for individual users
            }
        }));

        console.log(`DEBUG: Total verified signals for ${symbol}: ${verifiedSignals.length}`);
        return verifiedSignals.slice(0, 3); // Return top 3 verified

    } catch (error) {
        console.warn(`Neynar/Viem flow failed for ${symbol}`, error);
        return [];
    }
}

// --- SMART MOCK DATA ---
const MOCK_CASTS: SocialSignal[] = [
    { username: "vitalik.eth", avatar: "https://i.pravatar.cc/150?u=vitalik", action: "casted: 'Base L2 scaling looks promising'", timeAgo: "1h ago" },
    { username: "dwr.eth", avatar: "https://i.pravatar.cc/150?u=dwr", action: "casted: 'Farcaster frames on $DEGEN are wild'", timeAgo: "2h ago" },
    { username: "jesse.xyz", avatar: "https://i.pravatar.cc/150?u=jesse", action: "casted: 'Building on Base is different'", timeAgo: "10m ago" },
    { username: "linda_p", avatar: "https://i.pravatar.cc/150?u=linda", action: "bought $AERO dip", timeAgo: "5m ago" },
    { username: "defi_chad", avatar: "https://i.pravatar.cc/150?u=chad", action: "longing $DEGEN with leverage", timeAgo: "30m ago" },
    { username: "base_god", avatar: "https://i.pravatar.cc/150?u=god", action: "Airdrop season is coming", timeAgo: "4h ago" },
    { username: "nft_collector", avatar: "https://i.pravatar.cc/150?u=nft", action: "minted new frames", timeAgo: "12m ago" },
    { username: "alpha_hunter", avatar: "https://i.pravatar.cc/150?u=hunter", action: "cleaning up my wallet for $AERO", timeAgo: "1m ago" },
];

/**
 * Simple helper to format time ago (e.g. "2h ago")
 */
function timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
