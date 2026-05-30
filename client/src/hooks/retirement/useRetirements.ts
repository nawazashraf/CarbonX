import { useQuery } from "@tanstack/react-query";
import { getRetirements } from "@/api/retirement";

export const useRetirements = (wallet: string) => {
  return useQuery({
    queryKey: ["retirements", wallet],
    queryFn: () => getRetirements(wallet),
    enabled: !!wallet,
  });
};
