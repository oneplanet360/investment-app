import { useMutation } from "@tanstack/react-query";
import { resetInvestorPasswordFn } from "./adminInvestors.api";
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
