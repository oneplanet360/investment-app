import { axiosInstance } from "../../../lib/axios";

const CLIENT_WALLET_URL = `/client/wallet`;

export const getClientWalletFn = async (): Promise<{
  walletBalance: number;
  commissionBalance: number;
  investmentBalance: number;
  roiBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
}> => {
  const response = await axiosInstance.get(CLIENT_WALLET_URL);
  return response.data.data;
};

export const getClientWalletTransactionsFn = async (): Promise<unknown[]> => {
  const response = await axiosInstance.get(`${CLIENT_WALLET_URL}/transactions`);
  return response.data.transactions;
};
