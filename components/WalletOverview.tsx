"use client";

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletAdvancedAddressDetails,
    WalletAdvancedTokenHoldings,
    WalletAdvancedTransactionActions,
    WalletAdvancedWalletActions,
} from '@coinbase/onchainkit/wallet';
import {
    Avatar,
    Name,
} from '@coinbase/onchainkit/identity';

interface Asset {
    symbol: string;
    name: string;
    amount: number;
    value: number;
    change: string;
}

export function WalletOverview({ balance, portfolio }: { balance?: number; portfolio?: Asset[] }) {
    return (
        <div className="w-full rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-xl overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-48 h-48 text-indigo-500"
                >
                    <path d="M21 18v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v9ZM5 9a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1H5Zm1-8h10a1 1 0 0 1 1 1v2H5V2a1 1 0 0 1 1-1Z" />
                </svg>
            </div>

            <div className="relative z-10 p-6 flex flex-col gap-6">

                {/* Header / Connection Status */}
                <div className="flex justify-between items-center">
                    <h2 className="text-slate-400 text-sm font-medium tracking-wide uppercase">
                        Wallet Overview
                    </h2>
                    <Wallet>
                        <ConnectWallet className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-3 py-1 h-auto text-xs border border-slate-700">
                            <Avatar className="h-5 w-5" />
                            <Name className="text-white" />
                        </ConnectWallet>
                        <WalletDropdown>
                            <WalletAdvancedWalletActions />
                            <WalletAdvancedAddressDetails />
                            <WalletAdvancedTransactionActions />
                            <WalletAdvancedTokenHoldings />
                        </WalletDropdown>
                    </Wallet>
                </div>

                {/* Total Balance */}
                <div className="flex flex-col">
                    <span className="text-slate-400 text-sm">Total Balance</span>
                    <div className="text-4xl font-bold text-white tracking-tight">
                        ${balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </div>
                </div>

                {/* Assets List */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-slate-300 text-sm font-medium">Assets</h3>
                    <div className="flex flex-col gap-2">
                        {portfolio && portfolio.length > 0 ? (
                            portfolio.map((asset, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        {/* Icon Placeholder */}
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg">
                                            {asset.symbol[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white text-sm">{asset.symbol}</span>
                                            <span className="text-xs text-slate-400">{asset.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-medium text-white text-sm">${asset.value.toLocaleString()}</span>
                                        <span className="text-xs text-slate-400">{asset.amount} {asset.symbol}</span>
                                        {/* Optional: Change Indicator */}
                                        {/* <span className="text-xs text-emerald-400">{asset.change}</span> */}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-500 text-center py-4">No assets found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Actions (Optional) */}
            <div className="p-4 bg-slate-900/50 border-t border-slate-800 grid grid-cols-2 gap-3">
                <button className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
                    Send
                </button>
                <button className="py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors">
                    Receive
                </button>
            </div>
        </div>
    );
}
