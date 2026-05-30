"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/api/dashboard";

export const useDashboard = (wallet?: string) => {
  return useQuery({
    queryKey: ["dashboard", wallet],

    queryFn: () => dashboardService.getDashboard(wallet!),

    enabled: !!wallet,

    staleTime: 30000,
  });
};
