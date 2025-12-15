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
import { useAccount, useBalance } from 'wagmi';
import { SendModal } from './SendModal';
import { useState, useMemo } from 'react';

// Placeholder for TOKENS array, assuming it defines token details
// In a real application, this would likely be imported from a constants file or similar.
const TOKENS = [
    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`, symbol: 'USDC', name: 'USD Coin' },
    { address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22' as `0x${string}`, symbol: 'cbETH', name: 'Coinbase Wrapped Staked ETH' },
    { address: '0x4200000000000000000000000000000000000006' as `0x${string}`, symbol: 'WETH', name: 'Wrapped Ether' },
];

export function WalletOverview() {
    const { address, isConnected } = useAccount();
    const [isSendOpen, setIsSendOpen] = useState(false);
    const [isReceiveOpen, setIsReceiveOpen] = useState(false);

    const { data: ethBalance } = useBalance({ address });
    const { data: usdcBalance } = useBalance({ address, token: TOKENS[0].address });
    const { data: cbEthBalance } = useBalance({ address, token: TOKENS[1].address });
    const { data: wethBalance } = useBalance({ address, token: TOKENS[2].address });

    const portfolio = useMemo(() => {
        const assets = [];

        // Native ETH
        if (ethBalance && Number(ethBalance.formatted) > 0) {
            assets.push({
                symbol: ethBalance.symbol,
                name: 'Ethereum',
                amount: Number(Number(ethBalance.formatted).toFixed(4)),
                value: 0, // In a real app we need price feeds. For now we just show amount or 0 value.
            });
        }

        // USDC
        if (usdcBalance && Number(usdcBalance.formatted) > 0) {
            assets.push({
                symbol: TOKENS[0].symbol,
                name: TOKENS[0].name,
                amount: Number(Number(usdcBalance.formatted).toFixed(2)),
                value: Number(usdcBalance.formatted), // USDC is approx $1
            });
        }

        // cbETH
        if (cbEthBalance && Number(cbEthBalance.formatted) > 0) {
            assets.push({
                symbol: TOKENS[1].symbol,
                name: TOKENS[1].name,
                amount: Number(Number(cbEthBalance.formatted).toFixed(4)),
                value: 0,
            });
        }

        // WETH
        if (wethBalance && Number(wethBalance.formatted) > 0) {
            assets.push({
                symbol: TOKENS[2].symbol,
                name: TOKENS[2].name,
                amount: Number(Number(wethBalance.formatted).toFixed(4)),
                value: 0,
            });
        }

        return assets;
    }, [ethBalance, usdcBalance, cbEthBalance, wethBalance]);

    // Calculate estimated total (only USDC part is accurate without price feed)
    const totalBalance = useMemo(() => {
        let total = 0;
        portfolio.forEach(p => {
            if (p.symbol === 'USDC') total += p.value;
            // For ETH/cbETH we would need price. 
            // For now, let's just display USDC value or 0 if no USDC.
        });
        return total;
    }, [portfolio]);

    return (
        <>
            <SendModal isOpen={isSendOpen} onClose={() => setIsSendOpen(false)} />

            {/* Receive Modal (Inline) */}
            {isReceiveOpen && address && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl relative text-center">
                        <button
                            onClick={() => setIsReceiveOpen(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            ✕
                        </button>

                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white">Receive Assets</h2>
                            <p className="text-sm text-slate-400">Scan to send funds to this wallet</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl mx-auto w-fit">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`}
                                alt="Wallet QR Code"
                                className="w-48 h-48"
                            />
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 break-all">
                            <p className="text-xs text-slate-500 font-mono select-all">
                                {address}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(address);
                                // Optional: User toast feedback could go here
                            }}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Copy Address
                        </button>
                    </div>
                </div>
            )}

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
                                <span className="text-slate-400 text-sm">Est. Balance (USDC only)</span>
                                <div className="text-4xl font-bold text-white tracking-tight">
                                    ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    *Requires price feed for full ETH valuation
                                </p>
                            </div>

                            {/* Assets List */}
                            <div className="flex flex-col gap-3">
                                <h3 className="text-slate-300 text-sm font-medium">Assets</h3>
                                <div className="flex flex-col gap-2">
                                    {portfolio.length > 0 ? (
                                        portfolio.map((asset, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg">
                                                        {asset.symbol[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white text-sm">{asset.symbol}</span>
                                                        <span className="text-xs text-slate-400">{asset.name}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="font-medium text-white text-sm">
                                                        {asset.value > 0 ? `$${asset.value.toLocaleString()}` : '-'}
                                                    </span>
                                                    <span className="text-xs text-slate-400">{asset.amount} {asset.symbol}</span>
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
                                <button
                                    onClick={() => setIsSendOpen(true)}
                                    className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                                >
                                    Send
                                </button>
                                <button
                                    onClick={() => setIsReceiveOpen(true)}
                                    className="py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
                                >
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
        </>
    );
}
