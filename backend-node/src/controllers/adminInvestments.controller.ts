import { Request, Response } from 'express';
import {
  customApiResponse,
  customApiResponseWithPagination,
  customAsyncWrapper,
} from '../utils';
import { HttpStatusCode } from '../constants';
import {
  getInvestmentsService,
  getInvestmentDetailService,
  updateInvestmentStatusService,
} from '../services/adminInvestments.service';
import { InvestmentStatus } from '../database/models/investment.model';

export const getInvestmentsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const result = await getInvestmentsService(page, limit, status, search);

    return customApiResponseWithPagination({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investments retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
  }
);

export const getInvestmentDetailController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const trxId = req.params.trxId as string;
    const investmentDetail = await getInvestmentDetailService(trxId);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investment detail retrieved successfully',
      data: investmentDetail,
    });
  }
);

export const updateInvestmentStatusController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const trxId = req.params.trxId as string;
    const { status, adminRemarks } = req.body;

    const updated = await updateInvestmentStatusService(
      trxId,
      status as InvestmentStatus,
      adminRemarks
    );

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investment status updated successfully',
      data: updated,
    });
  }
);
