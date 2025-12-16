"use client";
import { ReactNode, useEffect } from "react";
import { baseSepolia, base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import sdk from "@farcaster/miniapp-sdk";
import "@coinbase/onchainkit/styles.css";

export function RootProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Signal to Farcaster client that the frame/app is ready
    sdk.actions.ready();
    console.log("Farcaster SDK Ready Signal Sent");
  }, []);

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
        },
        wallet: {
          display: "modal",
          preference: "all",
        },
      }}
      miniKit={{
        enabled: true,
        autoConnect: true,
        notificationProxyUrl: undefined,
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
