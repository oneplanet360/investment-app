import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getClientNotificationsApi,
  markNotificationReadApi,
} from "./clientNotifications.api";

export const useClientNotificationsQuery = () => {
  return useQuery({
    queryKey: ["clientNotifications"],
    queryFn: getClientNotificationsApi,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientNotifications"] });
    },
  });
};
