import { Request, Response } from 'express';
import {
  customApiResponse,
  customApiResponseWithPagination,
  customAsyncWrapper,
} from '../utils';
import { HttpStatusCode } from '../constants';
import {
  getNomineeSubmissionsService,
  getNomineeDetailService,
  updateNomineeStatusService,
} from '../services/adminNominee.service';
import { KycStatus } from '../database/models/user.model';

export const getNomineeSubmissionsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const result = await getNomineeSubmissionsService(page, limit, status, search);

    return customApiResponseWithPagination({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Nominee submissions retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
  }
);

export const getNomineeDetailController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const nomineeDetail = await getNomineeDetailService(id);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Nominee detail retrieved successfully',
      data: nomineeDetail,
    });
  }
);

export const updateNomineeStatusController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status, adminRemarks } = req.body;

    const updated = await updateNomineeStatusService(
      id,
      status as KycStatus,
      adminRemarks
    );

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Nominee status updated successfully',
      data: updated,
    });
  }
);
