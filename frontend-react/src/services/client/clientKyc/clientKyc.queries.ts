import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitClientKycFn, getClientKycStatusFn } from "./clientKyc.api";
import { AxiosError } from "axios";

export const useSubmitClientKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitClientKycFn,
    onSuccess: () => {
      toast.success("KYC application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["clientKycStatus"] });
      queryClient.invalidateQueries({ queryKey: ["clientVerifyUser"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to submit KYC");
      }
    },
  });
};

export const useClientKycStatusQuery = () => {
  return useQuery({
    queryKey: ["clientKycStatus"],
    queryFn: getClientKycStatusFn,
  });
};
