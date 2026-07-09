import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminInvestmentStatus } from "./adminInvestments.api";
import type { IUpdateInvestmentStatusPayload } from "./adminInvestments.types";

export const useUpdateInvestmentStatusMutation = (trxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateInvestmentStatusPayload) =>
      updateAdminInvestmentStatus(trxId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminInvestments"] });
      queryClient.invalidateQueries({ queryKey: ["adminInvestmentDetail", trxId] });
    },
  });
};
