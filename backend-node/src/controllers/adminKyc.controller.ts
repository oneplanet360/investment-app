import { Request, Response } from 'express';
import {
  customApiResponse,
  customApiResponseWithPagination,
  customAsyncWrapper,
} from '../utils';
import { HttpStatusCode } from '../constants';
import {
  getKycSubmissionsService,
  getKycDetailService,
  updateKycStatusService,
} from '../services/adminKyc.service';

export const getKycSubmissionsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const result = await getKycSubmissionsService(page, limit, status, search);

    return customApiResponseWithPagination({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'KYC submissions retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
  }
);

export const getKycDetailController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const kycDetail = await getKycDetailService(id);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'KYC detail retrieved successfully',
      data: kycDetail,
    });
  }
);

export const updateKycStatusController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status, remarks } = req.body;

    const updated = await updateKycStatusService(id, status, remarks);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'KYC status updated successfully',
      data: updated,
    });
  }
);
