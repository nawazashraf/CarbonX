"use client";

import { useAccount } from "wagmi";

export function useVerifier() {
  const { address } = useAccount();

  const isVerifier =
    address?.toLowerCase() ===
    process.env.NEXT_PUBLIC_VERIFIER_WALLET?.toLowerCase();

  return {
    isVerifier,
    address,
  };
}
