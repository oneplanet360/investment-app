import { axiosInstance } from "../../../lib/axios";
import type { IKyc, KycListResponse } from "./adminKyc.types";

const ADMIN_KYC_URL = `/kyc`;

export const getKycSubmissionsFn = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search: string = "",
): Promise<KycListResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (status) {
    params.append("status", status.toUpperCase());
  }
  if (search) {
    params.append("search", search);
  }

  const response = await axiosInstance.get(
    `${ADMIN_KYC_URL}?${params.toString()}`,
  );
  return { data: response.data.data, meta: response.data.meta };
};

export const getKycDetailFn = async (id: string): Promise<IKyc> => {
  const response = await axiosInstance.get(`${ADMIN_KYC_URL}/${id}`);
  return response.data.data;
};

export const updateKycStatusFn = async ({
  id,
  status,
  remarks,
}: {
  id: string;
  status: "APPROVED" | "REJECTED";
  remarks?: string;
}): Promise<IKyc> => {
  const response = await axiosInstance.put(`${ADMIN_KYC_URL}/${id}/status`, {
    status,
    remarks,
  });
  return response.data.data;
};
