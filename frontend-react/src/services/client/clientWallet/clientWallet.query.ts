import { useQuery } from "@tanstack/react-query";
import {
  getClientWalletFn,
  getClientWalletTransactionsFn,
} from "./clientWallet.api";

export const useClientWalletQuery = () => {
  return useQuery({
    queryKey: ["client-wallet"],
    queryFn: getClientWalletFn,
  });
};

export const useClientWalletTransactionsQuery = () => {
  return useQuery({
    queryKey: ["client-wallet-transactions"],
    queryFn: getClientWalletTransactionsFn,
  });
};
