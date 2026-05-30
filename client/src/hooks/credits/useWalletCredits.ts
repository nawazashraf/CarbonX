import { useQuery } from "@tanstack/react-query";
import { getWalletCredits } from "@/api/credits";

export const useWalletCredits = (wallet: string) => {
  return useQuery({
    queryKey: ["credits", wallet],
    queryFn: () => getWalletCredits(wallet),
    enabled: !!wallet,
  });
};
