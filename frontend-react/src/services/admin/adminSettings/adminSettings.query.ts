import { useQuery } from "@tanstack/react-query";
import { getAdminSettingsFn } from "./adminSettings.api";

export const useAdminSettingsQuery = () => {
  return useQuery({
    queryKey: ["adminSettings"],
    queryFn: getAdminSettingsFn,
    staleTime: Infinity,
  });
};
