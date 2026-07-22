import { useQuery } from "@tanstack/react-query";
import { getAdminRoiLogsApi } from "./adminRoi.api";
import type { AdminRoiResponse } from "./adminRoi.types";

export const useAdminRoiLogs = (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  status: string = "all"
) => {
  return useQuery<AdminRoiResponse>({
    queryKey: ["adminRoiLogs", page, limit, search, status],
    queryFn: () => getAdminRoiLogsApi(page, limit, search, status),
  });
};
