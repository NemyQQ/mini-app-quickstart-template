"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    opportunityName: string;
}

type Step = "confirm" | "pending" | "success";

export function TransactionModal({ isOpen, onClose, opportunityName }: TransactionModalProps) {
    const [step, setStep] = useState<Step>("confirm");

    // Reset state when opened
    useEffect(() => {
        if (isOpen) setStep("confirm");
    }, [isOpen]);

    // Auto-advance for simulation
    useEffect(() => {
        if (!isOpen) return;

        if (step === "confirm") {
            const timer = setTimeout(() => setStep("pending"), 1500); // Simulate user signing
            return () => clearTimeout(timer);
        }

        if (step === "pending") {
            const timer = setTimeout(() => setStep("success"), 2500); // Simulate blockchain confirmation
            return () => clearTimeout(timer);
        }

        if (step === "success") {
            const timer = setTimeout(onClose, 2000); // Auto close after success
            return () => clearTimeout(timer);
        }
    }, [step, isOpen, onClose]);

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
                                <h3 className="text-white font-bold">Transaction Status</h3>
                                <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col items-center text-center space-y-6">

                                {/* Icons based on state */}
                                <div className="relative">
                                    {step === "confirm" && (
                                        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                                            <span className="text-3xl">✍️</span>
                                        </div>
                                    )}
                                    {step === "pending" && (
                                        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                                    )}
                                    {step === "success" && (
                                        <motion.div
                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500"
                                        >
                                            <span className="text-3xl">✓</span>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Text */}
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold text-white">
                                        {step === "confirm" && "Waiting for Signature"}
                                        {step === "pending" && "Transaction Submitted"}
                                        {step === "success" && "Success!"}
                                    </h4>
                                    <p className="text-sm text-slate-400">
                                        {step === "confirm" && `Please sign the request in your wallet to invest in ${opportunityName}.`}
                                        {step === "pending" && "Waiting for block confirmation on Base..."}
                                        {step === "success" && `Successfully invested in ${opportunityName}.`}
                                    </p>
                                </div>

                                {/* Steps Indicator */}
                                <div className="flex gap-2">
                                    <div className={`h-1.5 w-8 rounded-full transition-colors ${step === "confirm" ? "bg-blue-500" : "bg-slate-700"}`} />
                                    <div className={`h-1.5 w-8 rounded-full transition-colors ${step === "pending" ? "bg-indigo-500" : "bg-slate-700"}`} />
                                    <div className={`h-1.5 w-8 rounded-full transition-colors ${step === "success" ? "bg-emerald-500" : "bg-slate-700"}`} />
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
