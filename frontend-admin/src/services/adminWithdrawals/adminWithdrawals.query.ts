import { useQuery } from "@tanstack/react-query";
import { getAdminWithdrawals, getAdminWithdrawalDetail } from "./adminWithdrawals.api";

export const useAdminWithdrawals = (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string,
  type?: string
) => {
  return useQuery({
    queryKey: ["adminWithdrawals", page, limit, status, search, type],
    queryFn: () => getAdminWithdrawals(page, limit, status, search, type),
  });
};

export const useAdminWithdrawalDetail = (trxId: string) => {
  return useQuery({
    queryKey: ["adminWithdrawalDetail", trxId],
    queryFn: () => getAdminWithdrawalDetail(trxId),
    enabled: !!trxId,
  });
};
