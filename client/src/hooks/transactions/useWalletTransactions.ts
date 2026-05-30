import { useQuery } from "@tanstack/react-query";
import { getTransactionsByWallet } from "@/api/transactions";

export const useWalletTransactions = (wallet: string) => {
  return useQuery({
    queryKey: ["transactions", wallet],
    queryFn: () => getTransactionsByWallet(wallet),
    enabled: !!wallet,
  });
};
