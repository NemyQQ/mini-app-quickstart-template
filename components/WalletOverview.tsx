"use client";

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
    WalletDropdownLink
} from '@coinbase/onchainkit/wallet';
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';

export function WalletOverview({ balance, asset }: { balance?: number; asset?: string }) {
    return (
        <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl overflow-hidden relative min-h-[160px]">
            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-32 h-32 text-indigo-500"
                >
                    <path d="M21 18v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v9ZM5 9a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1H5Zm1-8h10a1 1 0 0 1 1 1v2H5V2a1 1 0 0 1 1-1Z" />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
                <h2 className="text-slate-400 text-sm font-medium tracking-wide uppercase">
                    Wallet Scanner
                </h2>

                <Wallet>
                    <ConnectWallet className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                        <Avatar className="h-6 w-6" />
                        <Name />
                    </ConnectWallet>
                    <WalletDropdown>
                        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                            <Avatar />
                            <Name />
                            <Address className={color.foregroundMuted} />
                            <EthBalance />
                        </Identity>
                        <WalletDropdownLink
                            icon="wallet"
                            href="https://keys.coinbase.com"
                        >
                            Wallet
                        </WalletDropdownLink>
                        <WalletDropdownDisconnect />
                    </WalletDropdown>
                </Wallet>

                {/* Fallback/Status Text */}
                <p className="text-xs text-slate-500 mt-2">
                    Connect your wallet to scan for opportunities.
                </p>
            </div>
        </div>
    );
}

