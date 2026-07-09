import { Request, Response } from 'express';
import {
  customApiResponse,
  customApiResponseWithPagination,
  customAsyncWrapper,
} from '../utils';
import { HttpStatusCode } from '../constants';
import {
  getWithdrawalsService,
  getWithdrawalDetailService,
  updateWithdrawalStatusService,
} from '../services/adminWithdrawals.service';
import { WithdrawalStatus } from '../database/models/withdrawal.model';

export const getWithdrawalsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const type = req.query.type as string;

    const result = await getWithdrawalsService(
      page,
      limit,
      status,
      search,
      type
    );

    return customApiResponseWithPagination({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Withdrawals retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
  }
);

export const getWithdrawalDetailController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const trxId = req.params.trxId as string;
    const withdrawalDetail = await getWithdrawalDetailService(trxId);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Withdrawal detail retrieved successfully',
      data: withdrawalDetail,
    });
  }
);

export const updateWithdrawalStatusController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const trxId = req.params.trxId as string;
    const { status, adminRemarks } = req.body;

    const updated = await updateWithdrawalStatusService(
      trxId,
      status as WithdrawalStatus,
      adminRemarks
    );

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Withdrawal status updated successfully',
      data: updated,
    });
  }
);
