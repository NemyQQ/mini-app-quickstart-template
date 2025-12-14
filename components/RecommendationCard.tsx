"use client";

import { motion } from "framer-motion";
import { Opportunity } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function RecommendationCard({ data, onInvest }: { data: Opportunity; onInvest: (id: string) => void }) {
    const isAlpha = data.type === "alpha";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={cn(
                "relative w-full p-5 rounded-xl border backdrop-blur-sm transition-all duration-300",
                isAlpha
                    ? "bg-purple-950/20 border-purple-500/30 hover:bg-purple-900/20"
                    : "bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-900/20"
            )}
        >
            {/* Badge */}
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span
                    className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full shadow-lg border",
                        isAlpha
                            ? "bg-purple-600 text-white border-purple-400"
                            : "bg-emerald-600 text-white border-emerald-400"
                    )}
                >
                    {isAlpha ? "SOCIAL ALPHA 🚀" : "YIELD SCOUT 🛡️"}
                </span>
            </div>

            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-4xl rounded-full bg-slate-800 p-2 border border-slate-700">
                        {data.protocolIcon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{data.protocol}</h3>
                        <p className="text-xs text-slate-400">{data.asset}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-400">APY</p>
                    <p className={cn("text-2xl font-black", isAlpha ? "text-purple-400" : "text-emerald-400")}>
                        {data.apy}%
                    </p>
                </div>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                {data.description}
            </p>

            {/* Social Proof Section for Alpha Cards */}
            {isAlpha && data.socialSignals && (
                <div className="mt-4 p-3 rounded-lg bg-black/20 border border-purple-500/10">
                    <p className="text-xs font-semibold text-purple-300 mb-2 uppercase tracking-wide">
                        Detected Smart Money Moves
                    </p>
                    <div className="space-y-2">
                        {data.socialSignals.map((signal, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <img
                                    src={signal.avatar}
                                    alt={signal.username}
                                    className="w-6 h-6 rounded-full ring-1 ring-purple-500/50"
                                />
                                <div className="flex-1 text-xs text-slate-300">
                                    <span className="font-bold text-white">{signal.username}</span> {signal.action}
                                </div>
                                <span className="text-[10px] text-slate-500">{signal.timeAgo}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Button */}
            <button
                onClick={() => onInvest(data.id)}
                className={cn(
                    "mt-5 w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all",
                    isAlpha
                        ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                )}
            >
                {isAlpha ? "Inspect Alpha Signal" : "Start Earning Passive Yield"}
            </button>
        </motion.div>
    );
}
