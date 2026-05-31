import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";

import { waitForTransactionReceipt, readContract } from "@wagmi/core";

import { config } from "@/configs/wagmiConfig";

import { MARKETPLACE_ADDRESS, CARBON_TOKEN_ADDRESS } from "@/lib/contract";

import { marketplaceAbi } from "@/lib/abis/marketplaceAbi";
import { carbonAbi } from "@/lib/abis/carbonAbi";

import { syncListing } from "@/api/marketplace";

export const useCreateListing = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      creditsListed,
      pricePerCredit,
    }: {
      projectId: string;
      creditsListed: number;
      pricePerCredit: number;
    }) => {
      const contractListingId = Math.floor(Date.now() / 1000);
      const mockTxHash = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}`;

      const res = await syncListing({
        projectId,
        contractListingId,
        transactionHash: mockTxHash,
        sellerWallet: address!,
        creditsListed,
        pricePerCredit,
      });

      return res;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};
