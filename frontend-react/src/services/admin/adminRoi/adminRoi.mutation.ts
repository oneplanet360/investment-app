import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminRoiStatusApi } from "./adminRoi.api";

export const useUpdateAdminRoiStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trxId, status, amount }: { trxId: string; status: string; amount?: number }) =>
      updateAdminRoiStatusApi(trxId, status, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminRoiLogs"] });
    },
  });
};
