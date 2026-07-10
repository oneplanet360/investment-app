import { useQuery } from "@tanstack/react-query";
import { getKycSubmissionsFn, getKycDetailFn } from "./adminKyc.api";

export const useKycSubmissionsQuery = (page: number, limit: number, status?: string, search: string = "") => {
  return useQuery({
    queryKey: ["admin-kyc", page, limit, status, search],
    queryFn: () => getKycSubmissionsFn(page, limit, status, search),
  });
};

export const useKycDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["admin-kyc-detail", id],
    queryFn: () => getKycDetailFn(id),
    enabled: !!id,
  });
};
