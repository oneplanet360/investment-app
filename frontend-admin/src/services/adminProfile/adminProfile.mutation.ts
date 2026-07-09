import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminProfileFn, updateAdminPasswordFn } from "./adminProfile.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useUpdateAdminProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminProfileFn,
    onSuccess: (data) => {
      queryClient.setQueryData(["admin-profile"], data);
      toast.success("Profile updated successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to update profile",
        );
        return;
      }
      toast.error("Something went wrong");
    },
  });
};

export const useUpdateAdminPasswordMutation = () => {
  return useMutation({
    mutationFn: updateAdminPasswordFn,
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to update password",
        );
        return;
      }
      toast.error("Something went wrong");
    },
  });
};
