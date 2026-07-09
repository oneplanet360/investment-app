import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardApi } from "./adminDashboard.api";
import type { IDashboardData } from "./adminDashboard.types";

export const useAdminDashboard = () => {
  return useQuery<IDashboardData>({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboardApi,
  });
};
