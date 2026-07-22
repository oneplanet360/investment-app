import { Request, Response } from 'express';
import { customApiResponse, customApiResponseWithPagination, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import { getRoiLogsService, updateRoiStatusService } from '../services/adminRoi.service';
import { RoiStatus } from '../database/models/roi.model';

export const getRoiLogsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const status = req.query.status as string;

    const result = await getRoiLogsService(page, limit, search, status);

    return customApiResponseWithPagination({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'ROI logs retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
  }
);

export const updateRoiStatusController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const trxId = req.params.trxId;
    const { status, amount } = req.body;

    const updated = await updateRoiStatusService(trxId as string, status as RoiStatus, amount);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'ROI status updated successfully',
      data: updated,
    });
  }
);
