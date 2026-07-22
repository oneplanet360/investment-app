import { Request, Response } from 'express';
import { customApiResponse, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import {
  getInvestorsService,
  resetInvestorPasswordService,
} from '../services/adminInvestors.service';

export const getInvestorsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const pageParam = req.query.page;
    const page = parseInt(typeof pageParam === 'string' ? pageParam : '1') || 1;
    const limitParam = req.query.limit;
    const limit =
      parseInt(typeof limitParam === 'string' ? limitParam : '20') || 20;
    const searchParam = req.query.search;
    const search = typeof searchParam === 'string' ? searchParam : undefined;

    const result = await getInvestorsService(page, limit, search);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investors retrieved successfully',
      data: result.data,
    });
  }
);

import {
  getAdminUserDetailService,
  impersonateUserService,
  toggleUserBanService,
  sendNotificationService,
  updateInvestmentBalanceService,
} from '../services/adminUsers.service';
import { ParsedEnvVariables } from '../configs';

export const toggleBanInvestorController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const user = await toggleUserBanService(username as string, 'INVESTOR');
    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: `User ${user.isActive ? 'unbanned' : 'banned'} successfully`,
      data: user,
    });
  }
);

export const sendNotificationInvestorController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const { title, message } = req.body;
    const notification = await sendNotificationService(username as string, 'INVESTOR', title, message);
    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.CREATED,
      message: 'Notification sent successfully',
      data: notification,
    });
  }
);

export const impersonateInvestorController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const { user, token } = await impersonateUserService(username as string, 'INVESTOR');

    const cookieMaxAge = 24 * 60 * 60 * 1000;
    res.cookie('clientAccessToken', token, {
      httpOnly: true,
      secure: ParsedEnvVariables.NODE_ENV === 'production',
      sameSite: ParsedEnvVariables.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: cookieMaxAge,
    });

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Impersonated successfully',
      data: user,
    });
  }
);

        export const getInvestorDetailController = customAsyncWrapper(
          async (req: Request, res: Response) => {
            const { username } = req.params;
            const data = await getAdminUserDetailService(username as string, 'INVESTOR');
            if (!data) {
              return customApiResponse({
                response: res,
                statusCode: 404,
                message: 'Investor not found',
                data: null,
              });
            }
            return customApiResponse({
              response: res,
              statusCode: HttpStatusCode.OK,
              message: 'Investor detail retrieved successfully',
              data,
            });
          }
        );

        export const resetInvestorPasswordController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { newPassword } = req.body;

    await resetInvestorPasswordService(id, newPassword);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investor password reset successfully',
    });
  }
);

export const updateInvestmentBalanceController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const { action, amount } = req.body;

    if (!['add', 'deduct'].includes(action)) {
      return customApiResponse({
        response: res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: 'Invalid action',
      });
    }

    if (!amount || amount < 0) {
      return customApiResponse({
        response: res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: 'Amount must be a positive number',
      });
    }

    const updatedInvestment = await updateInvestmentBalanceService(username as string, action, Number(amount));

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: `Investment balance ${action === 'add' ? 'added' : 'deducted'} successfully`,
      data: updatedInvestment,
    });
  }
);
