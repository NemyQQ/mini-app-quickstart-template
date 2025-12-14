"use client";

import { useState } from "react";
import { WalletOverview } from "@/components/WalletOverview";
import { RecommendationCard } from "@/components/RecommendationCard";
import { USER_WALLET, OPPORTUNITIES } from "@/lib/mockData";

export default function Home() {
  const [investedId, setInvestedId] = useState<string | null>(null);

  const handleInvest = (id: string) => {
    // In a real app, this would trigger a transaction
    console.log("Investing in:", id);
    setInvestedId(id);
    alert(`Simulating investment flow for ${id}...`);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 pb-20 font-sans">
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
          <WalletOverview balance={USER_WALLET.balance} asset={USER_WALLET.asset} />
        </section>

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
            {OPPORTUNITIES.filter(o => o.type === "passive").map(opp => (
              <RecommendationCard
                key={opp.id}
                data={opp}
                onInvest={handleInvest}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Social Alpha (Active) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full bg-purple-500" />
            <h2 className="text-lg font-bold text-white">Social Alpha (Active)</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            High APY opportunities validated by your network.
          </p>

          <div className="space-y-4">
            {OPPORTUNITIES.filter(o => o.type === "alpha").map(opp => (
              <RecommendationCard
                key={opp.id}
                data={opp}
                onInvest={handleInvest}
              />
            ))}
          </div>
        </section>

        <footer className="pt-8 text-center text-xs text-slate-600">
          <p>Powered by Base & OnchainKit</p>
        </footer>
      </div>
    </main >
  );
}
