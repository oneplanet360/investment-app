import { useQuery } from "@tanstack/react-query";
import { getAdminDeposits, getAdminDepositDetail } from "./adminDeposits.api";

export const useAdminDeposits = (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["adminDeposits", page, limit, status, search],
    queryFn: () => getAdminDeposits(page, limit, status, search),
  });
};

export const useAdminDepositDetail = (trxId: string) => {
  return useQuery({
    queryKey: ["adminDepositDetail", trxId],
    queryFn: () => getAdminDepositDetail(trxId),
    enabled: !!trxId,
  });
};
