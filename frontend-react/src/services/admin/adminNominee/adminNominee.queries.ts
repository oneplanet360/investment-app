import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  getNomineeSubmissionsFn,
  getNomineeDetailFn,
  updateNomineeStatusFn,
} from "./adminNominee.api.ts";

export const useAdminNomineeSubmissionsQuery = (
  page: number,
  limit: number,
  status?: string,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["adminNomineeSubmissions", page, limit, status, search],
    queryFn: () => getNomineeSubmissionsFn(page, limit, status, search),
  });
};

export const useAdminNomineeDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["adminNomineeDetail", id],
    queryFn: () => getNomineeDetailFn(id),
    enabled: !!id,
  });
};

export const useUpdateNomineeStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNomineeStatusFn,
    onSuccess: (data) => {
      toast.success(
        `Nominee status updated to ${data.status.toLowerCase()} successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["adminNomineeSubmissions"] });
      queryClient.invalidateQueries({
        queryKey: ["adminNomineeDetail", data._id],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to update status");
      } else {
        toast.error("Failed to update status");
      }
    },
  });
};
