import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  createAgentFn,
  getAgentsFn,
  getAdminAgentDetailApi,
  impersonateAgentApi,
  toggleBanAgentApi,
  sendNotificationAgentApi,
} from "./adminAgents.api";

export const useCreateAgent = () => {
  return useMutation({
    mutationFn: createAgentFn,
  });
};

export const useAgentsQuery = (
  page: number,
  limit: number,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["admin-agents", page, limit, search],
    queryFn: () => getAgentsFn(page, limit, search),
  });
};

export const useAdminAgentDetail = (
  username: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["adminAgentDetail", username],
    queryFn: () => getAdminAgentDetailApi(username),
    enabled: options?.enabled,
  });
};

export const useImpersonateAgent = () => {
  return useMutation({
    mutationFn: impersonateAgentApi,
    onSuccess: () => {
      toast.success("Impersonation successful");
      window.location.href = "/agent/dashboard";
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to impersonate");
      }
    },
  });
};

export const useToggleBanAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleBanAgentApi,
    onSuccess: (data: { message?: string }) => {
      toast.success(data.message || "User status updated");
      queryClient.invalidateQueries({ queryKey: ["adminAgents"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to update user status",
        );
      }
    },
  });
};

export const useSendNotificationAgent = () => {
  return useMutation({
    mutationFn: sendNotificationAgentApi,
    onSuccess: () => {
      toast.success("Notification sent successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to send notification",
        );
      }
    },
  });
};
