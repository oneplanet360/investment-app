import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { clientSignInApi, clientSignOutApi, clientVerifyUserApi } from "./clientAuth.api";

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
    mutationFn: clientSignInApi,
    onSuccess: (data) => {
      toast.success(data.message || "Signed in successfully");
      queryClient.setQueryData(["clientVerifyUser"], data);
      
      if (data.data.role === 'AGENT') {
        navigate("/agent/dashboard");
      } else {
        navigate("/investor/dashboard");
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to sign in"
      );
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
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to sign out");
    },
  });
};
