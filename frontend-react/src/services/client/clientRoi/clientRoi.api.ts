import { axiosInstance } from "../../../lib/axios";
import type { ApiResponse } from "../../../types";

const CLIENT_ROI_URL = `/client/roi`;

export const getClientRoiFn = async (): Promise<ApiResponse<any[]>> => {
  const response = await axiosInstance.get(`${CLIENT_ROI_URL}/`);
  return response.data;
};
