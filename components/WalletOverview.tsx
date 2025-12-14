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
import { useAccount } from 'wagmi';

interface Asset {
    symbol: string;
    name: string;
    amount: number;
    value: number;
    change: string;
}

export function WalletOverview({ balance, portfolio }: { balance?: number; portfolio?: Asset[] }) {
    const { isConnected } = useAccount();

    return (
        <div className="w-full rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-xl overflow-hidden relative min-h-[400px]">
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

            <div className="relative z-10 p-6 flex flex-col gap-6 h-full">

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

                {isConnected ? (
                    <>
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

                        {/* Footer Actions */}
                        <div className="pt-4 mt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
                            <button className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
                                Send
                            </button>
                            <button className="py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors">
                                Receive
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-grow py-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-2 border border-slate-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-slate-300 font-medium text-lg">Wallet Not Connected</h3>
                            <p className="text-slate-500 text-sm max-w-[240px] mx-auto mt-1">Connect your wallet to view your balance and manage your assets.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
