import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminSignInApi,
  adminSignOutApi,
  adminVerifyUserApi,
} from "./adminAuth.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export const useAdminVerifyUser = () => {
  return useQuery({
    queryKey: ["adminAuth", "verify"],
    queryFn: adminVerifyUserApi,
    retry: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAdminSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: adminSignInApi,
    onSuccess: (data) => {
      toast.success(data.message || "Signed in successfully");
      queryClient.invalidateQueries({ queryKey: ["adminAuth"] });
      navigate("/admin/dashboard");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Failed to sign in");
        return;
      }
      toast.error("Failed to sign in");
    },
  });
};

export const useAdminSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: adminSignOutApi,
    onSuccess: (data) => {
      toast.success(data.message || "Signed out successfully");
      queryClient.clear();
      navigate("/");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Failed to sign out");
        return;
      }
      toast.error("Failed to sign out");
    },
  });
};
