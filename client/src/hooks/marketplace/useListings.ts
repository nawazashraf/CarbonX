import { useQuery } from "@tanstack/react-query";
import { getListings } from "@/api/marketplace";

export const useListings = () => {
  return useQuery({
    queryKey: ["listings"],
    queryFn: getListings,
  });
};
