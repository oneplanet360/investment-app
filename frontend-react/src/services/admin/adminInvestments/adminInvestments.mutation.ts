import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAdminInvestmentStatus } from "./adminInvestments.api";
import type { IUpdateInvestmentStatusPayload } from "./adminInvestments.types";

export const useUpdateInvestmentStatusMutation = (trxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateInvestmentStatusPayload) =>
      updateAdminInvestmentStatus(trxId, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Investment status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminInvestments"] });
      queryClient.invalidateQueries({
        queryKey: ["adminInvestmentDetail", trxId],
      });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to update investment status";
      toast.error(msg);
    },
  });
};
