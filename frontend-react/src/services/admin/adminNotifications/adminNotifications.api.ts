import { axiosInstance } from "../../../lib/axios";

export const getAdminNotificationsFn = async (params: { limit?: number; unreadOnly?: boolean } = {}) => {
  const { data } = await axiosInstance.get("/admin/notifications", { params });
  return data;
};

export const markNotificationReadFn = async (id: string) => {
  const { data } = await axiosInstance.put(`/admin/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsReadFn = async () => {
  const { data } = await axiosInstance.put("/admin/notifications/read-all");
  return data;
};
