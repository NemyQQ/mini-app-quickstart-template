"use client";

import { motion } from "framer-motion";

export function WalletOverview({ balance, asset }: { balance: number; asset: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-32 h-32 text-indigo-500"
                >
                    <path d="M21 18v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v9ZM5 9a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1H5Zm1-8h10a1 1 0 0 1 1 1v2H5V2a1 1 0 0 1 1-1Z" />
                </svg>
            </div>

            <div className="relative z-10">
                <h2 className="text-slate-400 text-sm font-medium tracking-wide uppercase">
                    Wallet Scanner
                </h2>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                        {balance.toLocaleString()}
                    </span>
                    <span className="text-xl font-semibold text-slate-400">{asset}</span>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-medium text-red-400">
                        Detected Idle Assets (0% APY)
                    </span>
                </div>

                <p className="mt-3 text-sm text-slate-400">
                    Your funds are sleeping. Put them to work with Alpha Scout.
                </p>
            </div>
        </motion.div>
    );
}
