import { useQuery } from "@tanstack/react-query";
import { getClientRoiFn } from "./clientRoi.api";

export const useClientRoiQuery = () => {
  return useQuery({
    queryKey: ["client-roi"],
    queryFn: getClientRoiFn,
  });
};
