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
