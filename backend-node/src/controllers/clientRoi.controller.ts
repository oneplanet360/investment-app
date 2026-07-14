import { Request, Response } from 'express';
import { customApiResponse, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import { Roi } from '../database/models/roi.model';

export const getClientRoiController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const roiLogs = await Roi.find({ investorId: req.user!._id })
      .populate('investmentId', 'trxId amount')
      .sort({ createdAt: -1 });
    
    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'ROI history retrieved successfully',
      data: roiLogs,
    });
  }
);
