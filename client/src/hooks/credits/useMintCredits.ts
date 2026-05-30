import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mintCredits } from "@/api/credits";

export const useMintCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mintCredits,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

