import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";

import { waitForTransactionReceipt, readContract } from "@wagmi/core";

import { config } from "@/configs/wagmiConfig";

import { MARKETPLACE_ADDRESS, USDC_ADDRESS } from "@/lib/contract";

import { marketplaceAbi } from "@/lib/abis/marketplaceAbi";

import { usdcAbi } from "@/lib/abis/usdcAbi";

import { createTransaction } from "@/api/transactions";

export const useBuyCredits = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: any) => {
      // Query listing details from contract to get the exact stored price in USDC (6 decimals)
      const contractListing = await readContract(config, {
        address: MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: "listings",
        args: [BigInt(listing.contractListingId)],
      });
      const contractPrice = contractListing[3]; // Struct index 3 is price

      const approveHash = await writeContractAsync({
        address: USDC_ADDRESS,
        abi: usdcAbi,
        functionName: "approve",
        args: [MARKETPLACE_ADDRESS, contractPrice],
      });

      await waitForTransactionReceipt(config, {
        hash: approveHash,
      });

      const buyHash = await writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: "buyCredits",
        args: [BigInt(listing.contractListingId)],
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: buyHash,
      });

      await createTransaction({
        listingId: listing._id,
        buyerWallet: address,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      });

      return receipt;
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

