import { useMutation, useQueryClient } from "@tanstack/react-query";
import { retireCredits } from "@/api/retirement";

export const useRetireCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: retireCredits,
    onSuccess: (_, variables) => {
      // Invalidate queries so portfolio and projects update
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["retirements", variables.ownerWallet] });
      queryClient.invalidateQueries({ queryKey: ["analyticsOverview"] });
    },
  });
};
