import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  clientLoginFn,
  clientSignOutApi,
  clientVerifyUserApi,
} from "./clientAuth.api";
import { AxiosError } from "axios";

export const useClientVerifyUser = () => {
  return useQuery({
    queryKey: ["clientVerifyUser"],
    queryFn: clientVerifyUserApi,
    retry: false,
  });
};

export const useClientSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: clientLoginFn,
    onSuccess: (data) => {
      toast.success(data.message || "Signed in successfully");
      queryClient.setQueryData(["clientVerifyUser"], data);

      // The API returns the user directly in data.data
      const user = (data as any)?.data;
      if (user?.role === "AGENT") {
        navigate("/agent/dashboard");
      } else {
        navigate("/investor/dashboard");
      }
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to sign in");
      } else {
        toast.error("Failed to sign in");
      }
    },
  });
};

export const useClientSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: clientSignOutApi,
    onSuccess: () => {
      toast.success("Signed out successfully");
      queryClient.setQueryData(["clientVerifyUser"], null);
      navigate("/");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to sign out");
      } else {
        toast.error("Failed to sign out");
      }
    },
  });
};
