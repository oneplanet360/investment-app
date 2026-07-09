import { Request, Response } from 'express';
import { customApiResponseWithPagination, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import { getCommissionLogsService } from '../services/adminCommissions.service';

export const getCommissionLogsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const level = req.query.level as string;

    const result = await getCommissionLogsService(page, limit, search, level);

    return customApiResponseWithPagination({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Commission logs retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
  }
);
