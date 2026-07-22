import { useQuery } from "@tanstack/react-query";
import { getAdminSettingsFn, getInvestmentSettingsFn } from "./adminSettings.api";

export const useAdminSettingsQuery = () => {
  return useQuery({
    queryKey: ["adminSettings"],
    queryFn: getAdminSettingsFn,
    staleTime: Infinity,
  });
};

export const useInvestmentSettings = () => {
  return useQuery({
    queryKey: ["investmentSettings"],
    queryFn: getInvestmentSettingsFn,
  });
};
