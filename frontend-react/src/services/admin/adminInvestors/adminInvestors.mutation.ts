import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetInvestorPasswordFn, updateInvestmentBalanceApi } from "./adminInvestors.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useResetInvestorPasswordMutation = () => {
  return useMutation({
    mutationFn: resetInvestorPasswordFn,
    onSuccess: () => {
      toast.success("Investor password reset successfully");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to reset password",
        );
        return;
      }
      toast.error("Something went wrong");
    },
  });
};

export const useUpdateInvestmentBalance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, action, amount }: { username: string; action: "add" | "deduct"; amount: number }) =>
      updateInvestmentBalanceApi(username, action, amount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adminInvestorDetail", variables.username],
      });
    },
  });
};
