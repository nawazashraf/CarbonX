import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, baseSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "CarbonX",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [baseSepolia],
  ssr: true,
});
