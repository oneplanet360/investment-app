import { axiosInstance } from "../../../lib/axios";
import type { IUser } from "../../../types";

const CLIENT_PROFILE_URL = `/client/profile`;

export const getClientProfileFn = async (): Promise<IUser> => {
  const response = await axiosInstance.get(CLIENT_PROFILE_URL);
  return response.data.user;
};

export const updateClientProfileFn = async (
  payload: Partial<IUser>,
): Promise<IUser> => {
  const response = await axiosInstance.put(CLIENT_PROFILE_URL, payload);
  return response.data.user;
};

export const updateClientPasswordFn = async (
  payload: Record<string, string>,
): Promise<void> => {
  await axiosInstance.put(`${CLIENT_PROFILE_URL}/password`, payload);
};
