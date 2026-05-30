import { useMutation } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";

import { waitForTransactionReceipt } from "@wagmi/core";

import { config } from "@/configs/wagmiConfig";

import { MARKETPLACE_ADDRESS, CARBON_TOKEN_ADDRESS } from "@/lib/contract";

import { marketplaceAbi } from "@/lib/abis/marketplaceAbi";
import { carbonAbi } from "@/lib/abis/carbonAbi";

import { syncListing } from "@/api/marketplace";

export const useCreateListing = () => {
  const { address } = useAccount();

  const { writeContractAsync } = useWriteContract();

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
      const totalPrice = creditsListed * pricePerCredit;

      const approveHash = await writeContractAsync({
        address: CARBON_TOKEN_ADDRESS,
        abi: carbonAbi,
        functionName: "approve",
        args: [MARKETPLACE_ADDRESS, BigInt(creditsListed)],
      });

      await waitForTransactionReceipt(config, {
        hash: approveHash,
      });

      const listHash = await writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: "listCredits",
        args: [BigInt(creditsListed), BigInt(totalPrice)],
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: listHash,
      });

      const contractListingId = 1; // temporary

      await syncListing({
        projectId,

        contractListingId,

        transactionHash: receipt.transactionHash,

        sellerWallet: address,

        creditsListed,

        pricePerCredit,
      });

      return receipt;
    },
  });
};
