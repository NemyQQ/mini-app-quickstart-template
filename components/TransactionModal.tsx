"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
    Swap,
    SwapAmountInput,
    SwapToggleButton,
    SwapButton,
    SwapMessage,
    SwapToast,
} from '@coinbase/onchainkit/swap';
import type { Token } from '@coinbase/onchainkit/token';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import { TRACKED_TOKENS, USDC_ADDRESS } from "@/lib/constants";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    opportunityName: string;
    targetAsset?: string;
}

export function TransactionModal({ isOpen, onClose, opportunityName, targetAsset }: TransactionModalProps) {
    const { address } = useAccount();

    const toToken = useMemo(() => {
        // 1. Try to find by Protocol Name (e.g. "Aerodrome" -> AERO)
        const tracked = TRACKED_TOKENS.find(t => opportunityName.includes(t.name));
        if (tracked) {
            return {
                name: tracked.name,
                address: tracked.address,
                symbol: tracked.symbol,
                decimals: 18,
                image: "",
                chainId: 8453,
            } as Token;
        }

        // 2. Fallback: Try to find by Asset Symbol (e.g. "USDC" -> USDC Address)
        if (targetAsset) {
            if (targetAsset.includes("USDC")) {
                return {
                    name: "USD Coin",
                    address: USDC_ADDRESS,
                    symbol: "USDC",
                    decimals: 6,
                    image: "",
                    chainId: 8453,
                } as Token;
            }
            if (targetAsset.includes("ETH") || targetAsset.includes("WETH")) {
                return {
                    name: "Wrapped Ether",
                    address: "0x4200000000000000000000000000000000000006",
                    symbol: "WETH",
                    decimals: 18,
                    image: "",
                    chainId: 8453,
                } as Token;
            }
        }

        return null;
    }, [opportunityName, targetAsset]);

    // Default From Token (USDC)
    const fromToken: Token = {
        name: "USD Coin",
        address: USDC_ADDRESS,
        symbol: "USDC",
        decimals: 6,
        image: "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe825e6dddd9f3aeb93ede4627881d60-USDC.png",
        chainId: 8453,
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                <h3 className="text-white font-bold">Trade {opportunityName}</h3>
                                <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {!address ? (
                                    <div className="flex flex-col items-center gap-4 py-8">
                                        <p className="text-slate-400 text-center">Connect wallet to trade</p>
                                        <Wallet>
                                            <ConnectWallet className="bg-white text-black font-bold px-4 py-2 rounded-full" />
                                        </Wallet>
                                    </div>
                                ) : toToken ? (
                                    <div className="w-full">
                                        <Swap className="w-full" isSponsored>
                                            <SwapAmountInput
                                                label="Sell"
                                                swappableTokens={[fromToken]}
                                                token={fromToken}
                                                type="from"
                                            />
                                            <SwapToggleButton />
                                            <SwapAmountInput
                                                label="Buy"
                                                swappableTokens={[toToken]}
                                                token={toToken}
                                                type="to"
                                            />
                                            <div className="h-4" />
                                            <SwapButton className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg" />
                                            <SwapMessage className="text-xs text-slate-400 mt-2 text-center" />
                                            <SwapToast />
                                        </Swap>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-slate-400">
                                        <p>Trading not available via Swap for {opportunityName}.</p>
                                        <p className="text-xs mt-2">Please use an external DEX.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

