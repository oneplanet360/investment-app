import { Request, Response } from 'express';
import { customApiResponse, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import { createInvestmentService } from '../services/clientInvestments.service';

export const createInvestmentController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: 'Invalid investment amount',
      });
    }

    const investment = await createInvestmentService(
      req.user!._id.toString(),
      Number(amount)
    );

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.CREATED,
      message: 'Investment created successfully and commissions distributed',
      data: investment,
    });
  }
);
