import { useQuery } from "@tanstack/react-query";
import { getAdminCommissionLogsApi } from "./adminCommissions.api";
import type { AdminCommissionResponse } from "./adminCommissions.types";

export const useAdminCommissionLogs = (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  level: string = "all",
) => {
  return useQuery<AdminCommissionResponse>({
    queryKey: ["adminCommissionLogs", page, limit, search, level],
    queryFn: () => getAdminCommissionLogsApi(page, limit, search, level),
  });
};
