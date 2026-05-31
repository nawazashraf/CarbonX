"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 bg-emerald-500/10 hover:bg-red-500/10 border border-emerald-500/20 hover:border-red-500/20 text-emerald-400 hover:text-red-400 text-xs font-mono font-bold rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer group shadow-lg shadow-emerald-500/5 active:scale-[0.98]"
        title="Click to disconnect wallet"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 group-hover:bg-red-400 animate-pulse shrink-0 transition-colors" />
        <span className="group-hover:hidden">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <span className="hidden group-hover:inline">Disconnect</span>
        <span className="material-symbols-outlined text-xs shrink-0 select-none transition-transform group-hover:translate-x-0.5">
          account_balance_wallet
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-600/15 hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] border border-blue-400/20 cursor-pointer"
    >
      <span className="material-symbols-outlined text-xs shrink-0 select-none">
        account_balance_wallet
      </span>
      Connect Wallet
    </button>
  );
}
