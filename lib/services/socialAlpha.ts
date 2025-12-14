import { Opportunity, OPPORTUNITIES, SocialSignal } from "../mockData";

// Candidates we want to track social signals for
const TRACKED_TOKENS = [
    { id: "alpha-1", query: "Aerodrome OR $AERO", name: "Aerodrome" },
    { id: "alpha-2", query: "Degen OR $DEGEN", name: "Degen" }, // Example: Adding support for more
];

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price?ids=aerodrome-finance,degen-base&vs_currencies=usd&include_24hr_change=true";

/**
 * Service to handle fetching of investment opportunities and social signals.
 * Now supports real data fetching via Neynar API and CoinGecko (for Onchain Price).
 */
export const socialAlphaService = {
    /**
     * Fetches the latest opportunities with their social signals and prices.
     */
    fetchOpportunities: async (): Promise<Opportunity[]> => {
        // 1. Check for API Key
        const apiKey = process.env.NEXT_PUBLIC_AIRSTACK_API_KEY;
        const shouldUseRealData = !!apiKey && apiKey !== "";

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
                            // Use the new Airstack fetcher
                            const signals = await fetchAirstackSignals(tracker.name.toUpperCase(), apiKey); // "AERODROME" or "DEGEN"
                            return { ...opp, socialSignals: signals };
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
 * Helper to fetch casts from Airstack API (Free Tier)
 */
async function fetchAirstackSignals(keyword: string, apiKey: string): Promise<SocialSignal[]> {
    const query = `
    query MyQuery {
      FarcasterCasts(
        input: {filter: {text: {_pattern: "${keyword}"}}, blockchain: ALL, limit: 3}
      ) {
        Cast {
          castedAtTimestamp
          text
          castedBy {
            profileName
            profileImage
          }
        }
      }
    }
  `;

    try {
        const response = await fetch("https://api.airstack.xyz/gql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": apiKey
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`Airstack API Error: ${response.statusText}`);
        }

        const json = await response.json();
        const casts = json.data?.FarcasterCasts?.Cast || [];

        // Transform Airstack response to our SocialSignal format
        return casts.map((cast: any) => ({
            username: cast.castedBy?.profileName || "anon",
            avatar: cast.castedBy?.profileImage || "https://i.pravatar.cc/150",
            action: `posted: "${cast.text.substring(0, 40)}..."`, // Show snippet of the text
            timeAgo: timeAgo(new Date(cast.castedAtTimestamp)),
        }));

    } catch (error) {
        console.warn("Airstack fetch failed, returning empty signals", error);
        return [];
    }
}

/**
 * Simple helper to format time ago (e.g. "2h ago")
 */
function timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
