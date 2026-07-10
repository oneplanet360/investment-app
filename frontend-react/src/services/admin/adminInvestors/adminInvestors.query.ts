import { useQuery } from "@tanstack/react-query";
import { getInvestorsFn, getAdminInvestorDetailApi } from "./adminInvestors.api";

export const useInvestorsQuery = (page: number, limit: number, search: string = "") => {
  return useQuery({
    queryKey: ["admin-investors", page, limit, search],
    queryFn: () => getInvestorsFn(page, limit, search),
  });
};

export const useAdminInvestorDetail = (username: string, options?: any) => {
  return useQuery({
    queryKey: ["adminInvestorDetail", username],
    queryFn: () => getAdminInvestorDetailApi(username),
    ...options
  });
};
