import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKycStatusFn } from "./adminKyc.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useUpdateKycStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateKycStatusFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-kyc"] });
      queryClient.invalidateQueries({ queryKey: ["admin-kyc-detail", data._id] });
      toast.success(`KYC ${data.status.toLowerCase()} successfully`);
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to update KYC status",
        );
        return;
      }
      toast.error("Something went wrong");
    },
  });
};
