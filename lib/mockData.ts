export type OpportunityType = "passive" | "alpha";

export interface SocialSignal {
    username: string;
    avatar: string;
    action: string;
    timeAgo: string;
}

export interface Opportunity {
    id: string;
    type: OpportunityType;
    protocol: string;
    protocolIcon: string;
    asset: string;
    apy: number;
    description: string;
    tvl?: string;
    socialSignals?: SocialSignal[];
    price?: string;
    change24h?: string;
}

export const USER_WALLET = {
    address: "0x123...abc",
    balance: 1000,
    asset: "USDC",
    status: "idle", // 'idle' | 'optimized'
};

export const OPPORTUNITIES: Opportunity[] = [
    {
        id: "passive-1",
        type: "passive",
        protocol: "Aave V3",
        protocolIcon: "👻",
        asset: "USDC",
        apy: 4.5,
        description: "Safe, supplied liquidity on Base's leading lending protocol.",
        tvl: "$50M",
    },
    {
        id: "alpha-1",
        type: "alpha",
        protocol: "Aerodrome",
        protocolIcon: "✈️",
        asset: "USDC-DAI LP",
        apy: 12.4,
        description: "High-yield liquidity provision. Volatility risk is low (Stable-Stable).",
        socialSignals: [
            {
                username: "@crypto_guru",
                avatar: "https://i.pravatar.cc/150?u=crypto_guru",
                action: "Deposited 50k USDC",
                timeAgo: "4h ago",
            },
            {
                username: "@dwr.eth",
                avatar: "https://i.pravatar.cc/150?u=dwr",
                action: "Bridged to Base",
                timeAgo: "12h ago",
            },
        ],
    },
];
