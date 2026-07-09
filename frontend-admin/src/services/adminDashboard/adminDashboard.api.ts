import { axiosInstance } from "../../lib/axios";
import type { IDashboardData } from "./adminDashboard.types";

export const getAdminDashboardApi = async (): Promise<IDashboardData> => {
  const { data } = await axiosInstance.get('/admin/dashboard');
  return data.data;
};
