import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminDepositStatus } from "./adminDeposits.api";
import type { IUpdateDepositStatusPayload } from "./adminDeposits.types";

export const useUpdateDepositStatusMutation = (trxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateDepositStatusPayload) =>
      updateAdminDepositStatus(trxId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDeposits"] });
      queryClient.invalidateQueries({
        queryKey: ["adminDepositDetail", trxId],
      });
    },
  });
};
