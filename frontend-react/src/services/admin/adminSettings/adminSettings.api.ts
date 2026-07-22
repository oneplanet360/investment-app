import { axiosInstance } from "../../../lib/axios";
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

export const getInvestmentSettingsFn = async (): Promise<any> => {
  const response = await axiosInstance.get(`${ADMINSETTINGS}/investment`);
  return response.data.data;
};

export const updateInvestmentSettingsFn = async (
  payload: any,
): Promise<any> => {
  const response = await axiosInstance.put(`${ADMINSETTINGS}/investment`, payload);
  return response.data.data;
};
