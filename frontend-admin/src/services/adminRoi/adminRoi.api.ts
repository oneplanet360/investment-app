import { axiosInstance } from "../../lib/axios";
import type { AdminRoiResponse } from "./adminRoi.types";

export const getAdminRoiLogsApi = async (
  page: number,
  limit: number,
  search: string
): Promise<AdminRoiResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/admin/roi`, {
    params: { page, limit, search },
  });
  return {
    data: data.data,
    meta: data.pagination,
  };
};
