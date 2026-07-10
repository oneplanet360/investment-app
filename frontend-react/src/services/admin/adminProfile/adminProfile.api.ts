import { axiosInstance } from "../../../lib/axios";
import type {
  IAdminProfile,
  AdminProfilePayload,
  AdminPasswordPayload,
} from "./adminProfile.types";

const ADMIN_PROFILE_URL = `/admin/profile`;

export const getAdminProfileFn = async (): Promise<IAdminProfile> => {
  const response = await axiosInstance.get(ADMIN_PROFILE_URL);
  return response.data.data;
};

export const updateAdminProfileFn = async (
  payload: AdminProfilePayload,
): Promise<IAdminProfile> => {
  const response = await axiosInstance.put(ADMIN_PROFILE_URL, payload);
  return response.data.data;
};

export const updateAdminPasswordFn = async (
  payload: AdminPasswordPayload,
): Promise<void> => {
  await axiosInstance.put(`${ADMIN_PROFILE_URL}/password`, payload);
};
