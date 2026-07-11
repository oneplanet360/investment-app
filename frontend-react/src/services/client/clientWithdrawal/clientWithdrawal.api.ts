import { axiosInstance } from "../../../lib/axios";
import type { IWithdrawal } from "../../../types";

const CLIENT_WITHDRAWAL_URL = `/client/withdrawals`;

export const getClientWithdrawalsFn = async (): Promise<IWithdrawal[]> => {
  const response = await axiosInstance.get(CLIENT_WITHDRAWAL_URL);
  return response.data.withdrawals;
};

export const requestClientWithdrawalFn = async (
  payload: Partial<IWithdrawal>,
): Promise<IWithdrawal> => {
  const response = await axiosInstance.post(CLIENT_WITHDRAWAL_URL, payload);
  return response.data.withdrawal;
};
