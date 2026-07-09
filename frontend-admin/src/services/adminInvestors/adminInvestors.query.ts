import { useQuery } from "@tanstack/react-query";
import { getInvestorsFn } from "./adminInvestors.api";

export const useInvestorsQuery = (page: number, limit: number, search: string = "") => {
  return useQuery({
    queryKey: ["admin-investors", page, limit, search],
    queryFn: () => getInvestorsFn(page, limit, search),
  });
};
