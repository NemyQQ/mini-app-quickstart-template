"use client";

import {
    Transaction,
    TransactionButton,
    TransactionSponsor,
    TransactionStatus,
    TransactionStatusLabel,
    TransactionStatusAction
} from '@coinbase/onchainkit/transaction';
import { useState } from 'react';
import { parseUnits } from 'viem';
import { USDC_ADDRESS } from '@/lib/constants';

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SendModal({ isOpen, onClose }: SendModalProps) {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    if (!isOpen) return null;

    // USDC Transfer Call
    const calls = ([
        {
            to: USDC_ADDRESS,
            data: {
                functionName: 'transfer',
                args: [recipient as `0x${string}`, parseUnits(amount || "0", 6)], // USDC has 6 decimals
                abi: [{
                    "inputs": [
                        { "name": "to", "type": "address" },
                        { "name": "amount", "type": "uint256" }
                    ],
                    "name": "transfer",
                    "outputs": [{ "name": "", "type": "bool" }],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }]
            }
        }
    ] as any);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white">Send USDC</h2>
                    <p className="text-sm text-slate-400">Transfer USDC on Base network</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Recipient Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Amount</label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-lg"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                <span className="text-slate-400 text-sm font-bold">USDC</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    {recipient && amount && parseFloat(amount) > 0 ? (
                        <Transaction
                            chainId={8453} // Base
                            calls={calls}
                            onStatus={(status) => console.log(status)}
                        >
                            <TransactionButton className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors" />
                            <TransactionStatus>
                                <TransactionStatusLabel />
                                <TransactionStatusAction />
                            </TransactionStatus>
                        </Transaction>
                    ) : (
                        <button disabled className="w-full py-3 rounded-xl font-bold text-slate-500 bg-slate-800 cursor-not-allowed">
                            Enter Details
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
