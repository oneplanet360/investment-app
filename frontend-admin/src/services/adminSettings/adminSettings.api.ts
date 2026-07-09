import { axiosInstance } from "../../lib/axios";
import type {
  IAdminSettings,
  AdminSettingsPayload,
} from "./adminSettings.types";

const ADMINSETTINGS = `/admin-settings`;

export const getAdminSettingsFn = async (): Promise<IAdminSettings> => {
  const response = await axiosInstance.get(ADMINSETTINGS);
  return response.data.data;
};

export const updateAdminSettingsFn = async (
  payload: AdminSettingsPayload,
): Promise<IAdminSettings> => {
  const response = await axiosInstance.put(ADMINSETTINGS, payload);
  return response.data.data;
};
