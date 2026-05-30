import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { verifyProject } from "@/api/verification";

export const useVerifyProject = () => {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { approvedCredits: number; remarks: string; verifierWallet?: string };
    }) => {
      if (!address) {
        throw new Error("Please connect your Web3 wallet first.");
      }
      return verifyProject(id, {
        ...payload,
        verifierWallet: payload.verifierWallet || address,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

