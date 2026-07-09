import { Request, Response } from 'express';
import { customApiResponse, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import { getAdminDashboardStatsService } from '../services/adminDashboard.service';

export const getAdminDashboardController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const data = await getAdminDashboardStatsService();
    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Dashboard stats retrieved successfully',
      data,
    });
  }
);
