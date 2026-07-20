import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitClientNomineeFn, getClientNomineeStatusFn } from "./clientNominee.api.ts";
import { AxiosError } from "axios";

export const useSubmitClientNominee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitClientNomineeFn,
    onSuccess: () => {
      toast.success("Nominee application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["clientNomineeStatus"] });
      queryClient.invalidateQueries({ queryKey: ["clientVerifyUser"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to submit Nominee verification");
      }
    },
  });
};

export const useClientNomineeStatusQuery = () => {
  return useQuery({
    queryKey: ["clientNomineeStatus"],
    queryFn: getClientNomineeStatusFn,
  });
};
