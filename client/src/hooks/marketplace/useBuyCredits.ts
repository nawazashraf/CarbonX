import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";

import { waitForTransactionReceipt, readContract } from "@wagmi/core";

import { config } from "@/configs/wagmiConfig";

import {
  MARKETPLACE_ADDRESS,
  USDC_ADDRESS,
  CARBON_TOKEN_ADDRESS,
} from "@/lib/contract";

import { marketplaceAbi } from "@/lib/abis/marketplaceAbi";
import { usdcAbi } from "@/lib/abis/usdcAbi";
import { carbonAbi } from "@/lib/abis/carbonAbi";

import { createTransaction } from "@/api/transactions";

export const useBuyCredits = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: any) => {
      try {
        console.log("============== BUY DEBUG ==============");
        console.log("Buyer Wallet:", address);
        console.log("Contract Listing ID:", listing.contractListingId);

        const contractListing = await readContract(config, {
          address: MARKETPLACE_ADDRESS,
          abi: marketplaceAbi,
          functionName: "listings",
          args: [BigInt(listing.contractListingId)],
        });

        console.log("On-chain Listing:", contractListing);

        const contractPrice = contractListing[3];
        const seller = contractListing[1];
        const active = contractListing[4];

        console.log("Seller:", seller);
        console.log("Active:", active);
        console.log("Price:", contractPrice.toString());

        const usdcBalance = await readContract(config, {
          address: USDC_ADDRESS,
          abi: usdcAbi,
          functionName: "balanceOf",
          args: [address!],
        });

        console.log("Buyer USDC Balance:", usdcBalance.toString());

        const marketplaceCarbonBalance = await readContract(config, {
          address: CARBON_TOKEN_ADDRESS,
          abi: carbonAbi,
          functionName: "balanceOf",
          args: [MARKETPLACE_ADDRESS],
        });

        console.log(
          "Marketplace Carbon Balance:",
          marketplaceCarbonBalance.toString(),
        );

        console.log("Approving USDC...");

        const approveHash = await writeContractAsync({
          address: USDC_ADDRESS,
          abi: usdcAbi,
          functionName: "approve",
          args: [MARKETPLACE_ADDRESS, contractPrice],
        });

        await waitForTransactionReceipt(config, {
          hash: approveHash,
        });

        console.log("USDC approved.");

        const allowance = await readContract(config, {
          address: USDC_ADDRESS,
          abi: usdcAbi,
          functionName: "allowance",
          args: [address!, MARKETPLACE_ADDRESS],
        });

        console.log("Allowance:", allowance.toString());

        console.log("Calling buyCredits...");

        // const count = await readContract(config, {
        //   address: MARKETPLACE_ADDRESS,
        //   abi: marketplaceAbi,
        //   functionName: "listingCount",
        // });

        // console.log("On-chain listingCount:", count.toString());
        console.log("Trying to buy listing:", listing.contractListingId);
        const count = await readContract(config, {
          address: MARKETPLACE_ADDRESS,
          abi: marketplaceAbi,
          functionName: "listingCount",
        });

        alert(`listingCount=${count}`);
        const buyHash = await writeContractAsync({
          address: MARKETPLACE_ADDRESS,
          abi: marketplaceAbi,
          functionName: "buyCredits",
          args: [BigInt(listing.contractListingId)],
        });
        const receipt = await waitForTransactionReceipt(config, {
          hash: buyHash,
        });

        console.log("Buy Success:", receipt.transactionHash);

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
