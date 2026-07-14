import { axiosInstance } from "../../../lib/axios";
import type { ApiResponse } from "../../../types";

const CLIENT_DEPOSITS_URL = `/client/deposits`;

export const getClientDepositsFn = async (): Promise<ApiResponse<any[]>> => {
  const response = await axiosInstance.get(`${CLIENT_DEPOSITS_URL}/`);
  return response.data;
};
