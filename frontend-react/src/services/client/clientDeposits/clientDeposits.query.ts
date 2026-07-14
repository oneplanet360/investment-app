import { useQuery } from "@tanstack/react-query";
import { getClientDepositsFn } from "./clientDeposits.api";

export const useClientDepositsQuery = () => {
  return useQuery({
    queryKey: ["client-deposits"],
    queryFn: getClientDepositsFn,
  });
};
