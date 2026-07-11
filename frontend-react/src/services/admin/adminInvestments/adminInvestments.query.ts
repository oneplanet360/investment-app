import { useQuery } from "@tanstack/react-query";
import {
  getAdminInvestments,
  getAdminInvestmentDetail,
} from "./adminInvestments.api";

export const useAdminInvestments = (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string,
) => {
  return useQuery({
    queryKey: ["adminInvestments", page, limit, status, search],
    queryFn: () => getAdminInvestments(page, limit, status, search),
  });
};

export const useAdminInvestmentDetail = (trxId: string) => {
  return useQuery({
    queryKey: ["adminInvestmentDetail", trxId],
    queryFn: () => getAdminInvestmentDetail(trxId),
    enabled: !!trxId,
  });
};
