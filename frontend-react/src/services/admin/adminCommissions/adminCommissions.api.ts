import { axiosInstance } from "../../../lib/axios";
import type { AdminCommissionResponse } from "./adminCommissions.types";

export const getAdminCommissionLogsApi = async (
  page: number,
  limit: number,
  search: string,
  level: string,
): Promise<AdminCommissionResponse> => {
  const { data } = await axiosInstance.get(`/admin/commissions`, {
    params: { page, limit, search, level },
  });
  return {
    data: data.data,
    meta: data.pagination,
  };
};
