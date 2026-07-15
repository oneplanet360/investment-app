import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  getAdminNotificationsFn,
  markNotificationReadFn,
  markAllNotificationsReadFn,
} from "./adminNotifications.api";

export const useAdminNotificationsQuery = (
  params: { limit?: number; unreadOnly?: boolean } = {},
) => {
  return useQuery({
    queryKey: ["adminNotifications", params],
    queryFn: () => getAdminNotificationsFn(params),
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationReadFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to mark as read");
      }
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsReadFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
      toast.success("All notifications marked as read");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to mark all as read",
        );
      }
    },
  });
};
