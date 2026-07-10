import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAgentFn, resetAgentPasswordFn } from "./adminAgents.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useCreateAgentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAgentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      toast.success("Agent created successfully!");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to create agent",
        );
        return;
      }
      toast.error("Something went wrong");
    },
  });
};

export const useResetAgentPasswordMutation = () => {
  return useMutation({
    mutationFn: resetAgentPasswordFn,
    onSuccess: () => {
      toast.success("Password reset successfully!");
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
