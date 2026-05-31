import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";

import { waitForTransactionReceipt } from "@wagmi/core";

import { config } from "@/configs/wagmiConfig";

import {
  MARKETPLACE_ADDRESS,
  USDC_ADDRESS,
} from "@/lib/contract";

import { usdcAbi } from "@/lib/abis/usdcAbi";
import { createTransaction } from "@/api/transactions";

export const useBuyCredits = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: any) => {
      try {
        if (!address) {
          throw new Error("Wallet not connected");
        }

        const totalPrice = listing.creditsListed * listing.pricePerCredit;
        const rawPrice = BigInt(Math.round(totalPrice * 1e6));

        console.log("Seller Wallet:", listing.sellerWallet);
        console.log("USDC Price:", rawPrice.toString());

        console.log("Approving USDC...");
        const approveHash = await writeContractAsync({
          address: USDC_ADDRESS,
          abi: usdcAbi,
          functionName: "approve",
          args: [MARKETPLACE_ADDRESS, rawPrice],
        });

        await waitForTransactionReceipt(config, {
          hash: approveHash,
          timeout: 60000,
        });

        console.log("USDC approved. Executing transfer to seller...");

        const buyHash = await writeContractAsync({
          address: USDC_ADDRESS,
          abi: usdcAbi,
          functionName: "transfer",
          args: [listing.sellerWallet as `0x${string}`, rawPrice],
        });

        const receipt = await waitForTransactionReceipt(config, {
          hash: buyHash,
          timeout: 60000,
        });

        console.log("Buy (Transfer) Success:", receipt.transactionHash);

        await createTransaction({
          listingId: listing._id,
          buyerWallet: address,
          txHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
        });

        return receipt;
      } catch (error) {
        console.error("========== BUY FAILED ==========");
        console.error(error);
        throw error;
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listings"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
  });
};
