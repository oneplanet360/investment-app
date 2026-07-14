import { axiosInstance } from "../../../lib/axios";
import type { ApiResponse, IInvestment } from "../../../types";

const CLIENT_INVESTMENT_URL = `/client/investments`;

export const createInvestmentFn = async (payload: {
  amount: number;
}): Promise<ApiResponse<IInvestment>> => {
  const response = await axiosInstance.post(
    `${CLIENT_INVESTMENT_URL}/create`,
    payload,
  );
  return response.data;
};

export const getClientInvestmentsFn = async (): Promise<ApiResponse<IInvestment[]>> => {
  const response = await axiosInstance.get(`${CLIENT_INVESTMENT_URL}/`);
  return response.data;
};

export const closeInvestmentFn = async (payload: { trxId: string }): Promise<ApiResponse<IInvestment>> => {
  const response = await axiosInstance.post(`${CLIENT_INVESTMENT_URL}/close`, payload);
  return response.data;
};
