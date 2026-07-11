import { axiosInstance } from "../../../lib/axios";

export const getClientNotificationsApi = async () => {
  const { data } = await axiosInstance.get(`/client/notifications`);
  return data.data;
};

export const markNotificationReadApi = async (id: string) => {
  const { data } = await axiosInstance.put(`/client/notifications/${id}/read`);
  return data.data;
};
