import { useQuery } from "@tanstack/react-query";
import { getAdminProfileFn } from "./adminProfile.api";

export const useAdminProfileQuery = () => {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: getAdminProfileFn,
    staleTime: Infinity,
  });
};
