import { axiosInstance } from "../../../lib/axios";
import type {
  InvestmentReportStats,
  RoiReportStats,
  WithdrawalReportStats,
  CommissionReportStats,
} from "./adminReports.types";

export const getAdminInvestmentReportApi =
  async (): Promise<InvestmentReportStats> => {
    const { data } = await axiosInstance.get("/admin/reports/investments");
    return data.data;
  };

export const getAdminRoiReportApi = async (): Promise<RoiReportStats> => {
  const { data } = await axiosInstance.get("/admin/reports/roi");
  return data.data;
};

export const getAdminWithdrawalReportApi =
  async (): Promise<WithdrawalReportStats> => {
    const { data } = await axiosInstance.get("/admin/reports/withdrawals");
    return data.data;
  };

export const getAdminCommissionReportApi =
  async (): Promise<CommissionReportStats> => {
    const { data } = await axiosInstance.get("/admin/reports/commissions");
    return data.data;
  };
