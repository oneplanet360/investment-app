import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminSettingsFn } from "./adminSettings.api";
import { toast } from "sonner";
import type { AdminSettingsPayload } from "./adminSettings.types";
import { AxiosError } from "axios";

export const useAdminSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminSettingsPayload) =>
      updateAdminSettingsFn(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["adminSettings"], data);
      toast.success("Appearance settings saved successfully.");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to update settings",
        );
        return;
      }
      toast.error("Something went wrong");
    },
  });
};
