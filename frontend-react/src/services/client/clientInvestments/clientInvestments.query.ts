import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvestmentFn } from "./clientInvestments.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useCreateInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvestmentFn,
    onSuccess: (data) => {
      toast.success(data.message || "Investment created successfully!");
      queryClient.invalidateQueries({ queryKey: ["client-wallet"] });
      queryClient.invalidateQueries({
        queryKey: ["client-wallet-transactions"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to create investment",
        );
      } else {
        toast.error("Failed to create investment");
      }
    },
  });
};
