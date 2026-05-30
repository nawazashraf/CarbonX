import { useMutation } from "@tanstack/react-query";
import { mintCredits } from "@/api/credits";

export const useMintCredits = () => {
  return useMutation({
    mutationFn: mintCredits,
  });
};
