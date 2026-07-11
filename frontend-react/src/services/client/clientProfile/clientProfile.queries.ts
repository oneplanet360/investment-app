import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getClientProfileFn,
  updateClientProfileFn,
  updateClientPasswordFn,
} from "./clientProfile.api";
import { AxiosError } from "axios";

export const useClientProfileQuery = () => {
  return useQuery({
    queryKey: ["clientProfile"],
    queryFn: getClientProfileFn,
  });
};

export const useUpdateClientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientProfileFn,
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      queryClient.setQueryData(["clientProfile"], data);
      queryClient.invalidateQueries({ queryKey: ["clientVerifyUser"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to update profile",
        );
      }
    },
  });
};

export const useUpdateClientPassword = () => {
  return useMutation({
    mutationFn: updateClientPasswordFn,
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to update password",
        );
      }
    },
  });
};
