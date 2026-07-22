import { axiosInstance } from "../../../lib/axios";
import type { AdminRoiResponse } from "./adminRoi.types";

export const getAdminRoiLogsApi = async (
  page: number,
  limit: number,
  search: string,
  status?: string,
): Promise<AdminRoiResponse> => {
  const { data } = await axiosInstance.get(`/admin/roi`, {
    params: { page, limit, search, status },
  });
  return {
    data: data.data,
    meta: data.pagination,
  };
};

export const updateAdminRoiStatusApi = async (
  trxId: string,
  status: string,
  amount?: number
) => {
  const { data } = await axiosInstance.put(`/admin/roi/${trxId}/status`, {
    status,
    amount
  });
  return data;
};
