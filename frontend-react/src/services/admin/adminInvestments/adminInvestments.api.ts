import { axiosInstance } from "../../../lib/axios";
import type {
  IInvestmentListResponse,
  IInvestmentResponse,
  IUpdateInvestmentStatusPayload,
} from "./adminInvestments.types";

export const getAdminInvestments = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string,
): Promise<IInvestmentListResponse> => {
  const response = await axiosInstance.get<IInvestmentListResponse>(
    `/admin/investments`,
    {
      params: { page, limit, status, search },
    },
  );
  return response.data;
};

export const getAdminInvestmentDetail = async (
  trxId: string,
): Promise<IInvestmentResponse> => {
  const response = await axiosInstance.get<IInvestmentResponse>(
    `/admin/investments/${trxId}`,
  );
  return response.data;
};

export const updateAdminInvestmentStatus = async (
  trxId: string,
  payload: IUpdateInvestmentStatusPayload,
): Promise<IInvestmentResponse> => {
  const response = await axiosInstance.patch<IInvestmentResponse>(
    `/admin/investments/${trxId}/status`,
    payload,
  );
  return response.data;
};
