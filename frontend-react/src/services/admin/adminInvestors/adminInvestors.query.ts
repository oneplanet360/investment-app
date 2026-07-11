import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInvestorsFn,
  getAdminInvestorDetailApi,
  impersonateInvestorApi,
  toggleBanInvestorApi,
  sendNotificationInvestorApi,
} from "./adminInvestors.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useInvestorsQuery = (
  page: number,
  limit: number,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["admin-investors", page, limit, search],
    queryFn: () => getInvestorsFn(page, limit, search),
  });
};

export const useAdminInvestorDetail = (
  username: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["adminInvestorDetail", username],
    queryFn: () => getAdminInvestorDetailApi(username),
    enabled: options?.enabled,
  });
};

export const useImpersonateInvestor = () => {
  return useMutation({
    mutationFn: impersonateInvestorApi,
    onSuccess: () => {
      toast.success("Impersonation successful");
      window.location.href = "/investor/dashboard";
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to impersonate");
      }
    },
  });
};

export const useToggleBanInvestor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleBanInvestorApi,
    onSuccess: (data: { message?: string }) => {
      toast.success(data.message || "User status updated");
      queryClient.invalidateQueries({ queryKey: ["adminInvestors"] });
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

export const useSendNotificationInvestor = () => {
  return useMutation({
    mutationFn: sendNotificationInvestorApi,
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
