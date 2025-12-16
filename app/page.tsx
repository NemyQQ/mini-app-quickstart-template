"use client";

import { useState, useEffect } from "react";
import { WalletOverview } from "@/components/WalletOverview";
import { RecommendationCard } from "@/components/RecommendationCard";
import { SocialAlphaFeed } from "@/components/SocialAlphaFeed";
import { USER_WALLET, Opportunity } from "@/lib/mockData";
import { socialAlphaService } from "@/lib/services/socialAlpha";
import { yieldService } from "@/lib/services/yieldService";
import { TransactionModal } from "@/components/TransactionModal";

export default function Home() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Transaction Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>("");
  const [selectedAsset, setSelectedAsset] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Parallel Fetch: Social Signals + Real Yields
        const [socialData, yieldData] = await Promise.all([
          socialAlphaService.fetchOpportunities(),
          yieldService.fetchYieldOpportunities()
        ]);

        // Merge strategies:
        // 1. Get Alpha items from socialData
        const socialAlphaItems = socialData.filter(o => o.type === "alpha");

        // 2. Use Real Yield items (or fallback to socialData passive if yieldService fails/returns empty)
        const passiveItems = yieldData.length > 0
          ? yieldData
          : socialData.filter(o => o.type === "passive");

        setOpportunities([...passiveItems, ...socialAlphaItems]);
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInvest = (id: string) => {
    const opp = opportunities.find(o => o.id === id);
    setSelectedOpportunity(opp?.protocol || "Protocol");
    setSelectedAsset(opp?.asset || "");
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 pb-20 font-sans">
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        opportunityName={selectedOpportunity}
      />

      <div className="max-w-md mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
              α
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Alpha Scout
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
            {USER_WALLET.address}
          </div>
        </header>

        {/* Wallet Scanner */}
        <section>
          <WalletOverview />
        </section>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-40 bg-slate-900/50 rounded-xl border border-slate-800"></div>
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-40 bg-slate-900/50 rounded-xl border border-slate-800"></div>
          </div>
        ) : (
          <>
            {/* Section 1: Yield Scout (Passive) */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 rounded-full bg-emerald-500" />
                <h2 className="text-lg font-bold text-white">Yield Scout (Passive)</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Low risk, stable returns for your idle assets.
              </p>

              <div className="space-y-4">
                {opportunities.filter(o => o.type === "passive").map(opp => (
                  <RecommendationCard
                    key={opp.id}
                    data={opp}
                    onInvest={handleInvest}
                  />
                ))}
              </div>
            </section>

            {/* Section 2: Social Alpha (Active) - Refactored */}
            <SocialAlphaFeed
              opportunities={opportunities}
              onInvest={handleInvest}
            />
          </>
        )}

        <footer className="pt-8 text-center text-xs text-slate-600">
          <p>Powered by Base & OnchainKit</p>
        </footer>
      </div>
    </main >
  );
}
