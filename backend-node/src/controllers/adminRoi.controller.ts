import { Request, Response } from 'express';
import { customApiResponseWithPagination, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import { getRoiLogsService } from '../services/adminRoi.service';

export const getRoiLogsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const result = await getRoiLogsService(page, limit, search);

    return customApiResponseWithPagination({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'ROI logs retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
  }
);
