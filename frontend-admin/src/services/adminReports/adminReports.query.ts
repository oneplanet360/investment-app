import { useQuery } from "@tanstack/react-query";
import {
  getAdminInvestmentReportApi,
  getAdminRoiReportApi,
  getAdminWithdrawalReportApi,
  getAdminCommissionReportApi,
} from "./adminReports.api";
import type {
  InvestmentReportStats,
  RoiReportStats,
  WithdrawalReportStats,
  CommissionReportStats,
} from "./adminReports.types";

export const useAdminInvestmentReport = () => {
  return useQuery<InvestmentReportStats>({
    queryKey: ["adminInvestmentReport"],
    queryFn: getAdminInvestmentReportApi,
  });
};

export const useAdminRoiReport = () => {
  return useQuery<RoiReportStats>({
    queryKey: ["adminRoiReport"],
    queryFn: getAdminRoiReportApi,
  });
};

export const useAdminWithdrawalReport = () => {
  return useQuery<WithdrawalReportStats>({
    queryKey: ["adminWithdrawalReport"],
    queryFn: getAdminWithdrawalReportApi,
  });
};

export const useAdminCommissionReport = () => {
  return useQuery<CommissionReportStats>({
    queryKey: ["adminCommissionReport"],
    queryFn: getAdminCommissionReportApi,
  });
};
