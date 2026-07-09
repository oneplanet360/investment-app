import { Request, Response } from 'express';
import {
  customApiResponse,
  customApiResponseWithPagination,
  customAsyncWrapper,
} from '../utils';
import { HttpStatusCode } from '../constants';
import {
  getDepositsService,
  getDepositDetailService,
  updateDepositStatusService,
} from '../services/adminDeposits.service';
import { DepositStatus } from '../database/models/deposit.model';

export const getDepositsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const result = await getDepositsService(page, limit, status, search);

    return customApiResponseWithPagination({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Deposits retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
  }
);

export const getDepositDetailController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const trxId = req.params.trxId as string;
    const depositDetail = await getDepositDetailService(trxId);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Deposit detail retrieved successfully',
      data: depositDetail,
    });
  }
);

export const updateDepositStatusController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const trxId = req.params.trxId as string;
    const { status, adminRemarks } = req.body;

    const updated = await updateDepositStatusService(
      trxId,
      status as DepositStatus,
      adminRemarks
    );

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Deposit status updated successfully',
      data: updated,
    });
  }
);
