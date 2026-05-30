import { useQuery } from "@tanstack/react-query";
import { getOverview } from "@/api/analytics";

export const useOverview = () => {
  return useQuery({
    queryKey: ["analyticsOverview"],
    queryFn: getOverview,
  });
};
