import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "CarbonX",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "37e0ba054fb6add85058f05d1484f891",
  chains: [mainnet, sepolia],
  ssr: true,
});
