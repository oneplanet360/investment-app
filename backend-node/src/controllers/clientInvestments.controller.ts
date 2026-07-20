import { Request, Response } from 'express';
import { customApiResponse, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import { createInvestmentService, getClientInvestmentsService, closeInvestmentRequestService } from '../services/clientInvestments.service';

export const createInvestmentController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { amount, type } = req.body;
    const paymentProof = req.file?.path;

    if (!amount || amount <= 0) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: 'Invalid investment amount',
      });
    }

    if (!paymentProof) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: 'Payment proof is required',
      });
    }

    const investment = await createInvestmentService(
      req.user!._id.toString(),
      Number(amount),
      type,
      paymentProof
    );

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.CREATED,
      message: 'Investment request submitted successfully. Pending Admin approval.',
      data: investment,
    });
  }
);

export const getClientInvestmentsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const investments = await getClientInvestmentsService(req.user!._id.toString());
    
    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investments retrieved successfully',
      data: investments,
    });
  }
);

export const closeInvestmentController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { trxId } = req.body;
    if (!trxId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: 'Transaction ID (trxId) is required',
      });
    }

    const investment = await closeInvestmentRequestService(req.user!._id.toString(), trxId);
    
    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investment close request submitted successfully',
      data: investment,
    });
  }
);
