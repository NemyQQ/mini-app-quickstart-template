"use client";

import { useState } from "react";
import { Opportunity } from "@/lib/mockData";
import { RecommendationCard } from "./RecommendationCard";
import { cn } from "@/lib/utils";

interface SocialAlphaFeedProps {
    opportunities: Opportunity[];
    onInvest: (id: string) => void;
}

export function SocialAlphaFeed({ opportunities, onInvest }: SocialAlphaFeedProps) {
    const [filter, setFilter] = useState("ALL");

    // Extract unique tokens/protocols effectively for the filter list
    // We manually curate the top ones or derive from opportunities
    const filters = [
        { id: "ALL", label: "All" },
        { id: "Aerodrome", label: "AERO" },
        { id: "Degen", label: "DEGEN" },
        { id: "Brett", label: "BRETT" },
        { id: "Toshi", label: "TOSHI" },
        { id: "Mog", label: "MOG" },
        { id: "Virtual", label: "VIRTUAL" },
        { id: "Prime", label: "PRIME" },
        { id: "Higher", label: "HIGHER" },
        { id: "Keyboard", label: "KEYCAT" },
        { id: "Base God", label: "TYBG" },
    ];

    const filteredOpportunities = opportunities.filter(op => {
        if (op.type !== "alpha") return false;
        if (filter === "ALL") return true;
        return op.protocol.includes(filter) || (op.asset && op.asset.includes(filter));
    });

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 rounded-full bg-purple-500" />
                <h2 className="text-lg font-bold text-white">Social Alpha (Active)</h2>
            </div>

            <p className="text-sm text-slate-400">
                High APY opportunities validated by your network.
            </p>

            {/* Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 mask-fade-sides">
                {filters.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                            filter === f.id
                                ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/30"
                                : "bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Cards Grid */}
            <div className="space-y-4 min-h-[300px]">
                {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map(opp => (
                        <RecommendationCard
                            key={opp.id}
                            data={opp}
                            onInvest={onInvest}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                        <p>No active signals found for this token currently.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
