import { axiosInstance } from "../../../lib/axios";
import type {
  IDepositListResponse,
  IDepositResponse,
  IUpdateDepositStatusPayload,
} from "./adminDeposits.types";

export const getAdminDeposits = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string,
): Promise<IDepositListResponse> => {
  const response = await axiosInstance.get<IDepositListResponse>(
    `/admin/deposits`,
    {
      params: { page, limit, status, search },
    },
  );
  return response.data;
};

export const getAdminDepositDetail = async (
  trxId: string,
): Promise<IDepositResponse> => {
  const response = await axiosInstance.get<IDepositResponse>(
    `/admin/deposits/${trxId}`,
  );
  return response.data;
};

export const updateAdminDepositStatus = async (
  trxId: string,
  payload: IUpdateDepositStatusPayload,
): Promise<IDepositResponse> => {
  const response = await axiosInstance.patch<IDepositResponse>(
    `/admin/deposits/${trxId}/status`,
    payload,
  );
  return response.data;
};
