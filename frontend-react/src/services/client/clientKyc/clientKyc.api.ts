import { axiosInstance } from "../../../lib/axios";
import type { IKyc } from "../../../types";

const CLIENT_KYC_URL = `/client/kyc`;

export const submitClientKycFn = async (payload: {
  documentType: string;
  documentNumber?: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
}): Promise<IKyc> => {
  const response = await axiosInstance.post(`${CLIENT_KYC_URL}`, payload);
  return response.data;
};

export const getClientKycStatusFn = async (): Promise<IKyc> => {
  const response = await axiosInstance.get(`${CLIENT_KYC_URL}`);
  return response.data.kyc;
};
