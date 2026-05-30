
import { useQuery } from "@tanstack/react-query";

import { marketplaceService } from "@/api/marketplace";

export const useMyListings = (wallet?: string) => {
  return useQuery({
    queryKey: ["my-listings", wallet],
    queryFn: () => marketplaceService.getMyListings(wallet!),
    enabled: !!wallet,
  });
};
