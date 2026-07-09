import { Request, Response } from 'express';
import { customApiResponse, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import {
  getInvestorsService,
  resetInvestorPasswordService,
} from '../services/adminInvestors.service';

export const getInvestorsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const pageParam = req.query.page;
    const page = parseInt(typeof pageParam === 'string' ? pageParam : '1') || 1;
    const limitParam = req.query.limit;
    const limit =
      parseInt(typeof limitParam === 'string' ? limitParam : '20') || 20;
    const searchParam = req.query.search;
    const search = typeof searchParam === 'string' ? searchParam : undefined;

    const result = await getInvestorsService(page, limit, search);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investors retrieved successfully',
      data: result.data,
    });
  }
);

export const resetInvestorPasswordController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { newPassword } = req.body;

    await resetInvestorPasswordService(id, newPassword);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investor password reset successfully',
    });
  }
);
