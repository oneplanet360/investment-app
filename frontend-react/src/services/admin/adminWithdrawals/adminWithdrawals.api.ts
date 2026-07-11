import { axiosInstance } from "../../../lib/axios";
import type {
  IWithdrawalListResponse,
  IWithdrawalResponse,
  IUpdateWithdrawalStatusPayload,
} from "./adminWithdrawals.types";

export const getAdminWithdrawals = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string,
  type?: string,
): Promise<IWithdrawalListResponse> => {
  const response = await axiosInstance.get<IWithdrawalListResponse>(
    `/admin/withdrawals`,
    {
      params: { page, limit, status, search, type },
    },
  );
  return response.data;
};

export const getAdminWithdrawalDetail = async (
  trxId: string,
): Promise<IWithdrawalResponse> => {
  const response = await axiosInstance.get<IWithdrawalResponse>(
    `/admin/withdrawals/${trxId}`,
  );
  return response.data;
};

export const updateAdminWithdrawalStatus = async (
  trxId: string,
  payload: IUpdateWithdrawalStatusPayload,
): Promise<IWithdrawalResponse> => {
  const response = await axiosInstance.patch<IWithdrawalResponse>(
    `/admin/withdrawals/${trxId}/status`,
    payload,
  );
  return response.data;
};
