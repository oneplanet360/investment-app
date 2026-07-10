import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminWithdrawalStatus } from "./adminWithdrawals.api";
import type { IUpdateWithdrawalStatusPayload } from "./adminWithdrawals.types";

export const useUpdateWithdrawalStatusMutation = (trxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateWithdrawalStatusPayload) =>
      updateAdminWithdrawalStatus(trxId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawalDetail", trxId] });
    },
  });
};
