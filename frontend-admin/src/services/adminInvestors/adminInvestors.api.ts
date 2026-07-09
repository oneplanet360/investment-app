import { axiosInstance } from "../../lib/axios";
import type { InvestorListResponse, ResetInvestorPasswordPayload } from "./adminInvestors.types";

const ADMIN_INVESTORS_URL = `/investors`;

export const getInvestorsFn = async (
  page: number = 1,
  limit: number = 20,
  search: string = ""
): Promise<InvestorListResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) {
    params.append("search", search);
  }
  
  const response = await axiosInstance.get(`${ADMIN_INVESTORS_URL}?${params.toString()}`);
  return { data: response.data.data, meta: response.data.meta };
};

export const resetInvestorPasswordFn = async (payload: ResetInvestorPasswordPayload): Promise<void> => {
  await axiosInstance.put(`${ADMIN_INVESTORS_URL}/${payload.investorId}/password-reset`, {
    newPassword: payload.newPassword,
  });
};
