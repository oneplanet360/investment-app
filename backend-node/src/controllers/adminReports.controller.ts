import { Request, Response } from 'express';
import { customApiResponse, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import {
  getInvestmentReportStatsService,
  getRoiReportStatsService,
  getWithdrawalReportStatsService,
  getCommissionReportStatsService,
} from '../services/adminReports.service';

export const getInvestmentReportController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const stats = await getInvestmentReportStatsService();

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investment report stats retrieved successfully',
      data: stats,
    });
  }
);

export const getRoiReportController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const stats = await getRoiReportStatsService();

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'ROI report stats retrieved successfully',
      data: stats,
    });
  }
);

export const getWithdrawalReportController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const stats = await getWithdrawalReportStatsService();

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Withdrawal report stats retrieved successfully',
      data: stats,
    });
  }
);

export const getCommissionReportController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const stats = await getCommissionReportStatsService();

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Commission report stats retrieved successfully',
      data: stats,
    });
  }
);
