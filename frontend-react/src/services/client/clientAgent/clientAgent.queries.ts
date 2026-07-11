import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  searchUnassignedUserFn,
  assignClientInvestorFn,
  getClientInvestorsFn,
  assignClientSubAgentFn,
  getClientAgentTreeFn,
} from "./clientAgent.api";
import { AxiosError } from "axios";

export const useSearchUnassignedUser = (
  username: string,
  targetRole: string,
) => {
  return useQuery({
    queryKey: ["searchUnassignedUser", username, targetRole],
    queryFn: () => searchUnassignedUserFn(username, targetRole),
    enabled: !!username && !!targetRole,
    retry: false,
  });
};

export const useAssignClientInvestor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignClientInvestorFn,
    onSuccess: () => {
      toast.success("Investor assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["clientInvestors"] });
      queryClient.invalidateQueries({ queryKey: ["clientAgentTree"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to assign investor",
        );
      } else {
        toast.error("Failed to assign investor");
      }
    },
  });
};

export const useClientInvestorsQuery = () => {
  return useQuery({
    queryKey: ["clientInvestors"],
    queryFn: getClientInvestorsFn,
  });
};

export const useAssignClientSubAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignClientSubAgentFn,
    onSuccess: () => {
      toast.success("Sub-agent assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["clientAgentTree"] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to assign sub-agent",
        );
      } else {
        toast.error("Failed to assign sub-agent");
      }
    },
  });
};

export const useClientAgentTreeQuery = () => {
  return useQuery({
    queryKey: ["clientAgentTree"],
    queryFn: getClientAgentTreeFn,
  });
};
