"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletButton() {
  const [walletDetected, setWalletDetected] = useState<boolean | null>(null);

  useEffect(() => {
    const ethereum =
      typeof window !== "undefined"
        ? (window as any).ethereum
        : undefined;

    setWalletDetected(Boolean(ethereum));
  }, []);

  if (walletDetected === null) {
    return (
      <button
        disabled
        className="brand-gradient px-6 py-2.5 rounded-xl font-label-md text-sm text-on-primary font-bold opacity-70"
      >
        Loading...
      </button>
    );
  }

  if (!walletDetected) {
    return (
      <button
        onClick={() =>
          window.open("https://metamask.io/download/", "_blank")
        }
        className="brand-gradient px-6 py-2.5 rounded-xl font-label-md text-sm text-on-primary font-bold shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all scale-95 active:scale-90 cursor-pointer flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">
          rocket_launch
        </span>

        Get Started
      </button>
    );
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        openAccountModal,
        openConnectModal,
      }) => {
        const connected = mounted && account && chain;

        return (
          <button
            onClick={() =>
              connected
                ? openAccountModal()
                : openConnectModal()
            }
            className="brand-gradient px-6 py-2.5 rounded-xl font-label-md text-sm text-on-primary font-bold shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all scale-95 active:scale-90 cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              {connected
                ? "account_balance_wallet"
                : "login"}
            </span>

            {connected
              ? account.displayName
              : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}