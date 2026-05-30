import { useQuery } from "@tanstack/react-query";

import { marketplaceService } from "@/api/marketplace";

export const useMarketplace = () => {
  return useQuery({
    queryKey: ["marketplace"],
    queryFn: marketplaceService.getListings,
  });
};
