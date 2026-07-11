import { Request, Response } from 'express';
import {
  customApiResponse,
  customApiResponseWithPagination,
  customAsyncWrapper,
} from '../utils';
import { HttpStatusCode } from '../constants';
import {
  createAgentService,
  getAgentsService,
  resetAgentPasswordService,
} from '../services/adminAgents.service';

export const createAgentController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const agent = await createAgentService(req.body);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.CREATED,
      message: 'Agent created successfully',
      data: agent,
    });
  }
);

export const getAgentsController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const result = await getAgentsService(page, limit, search);

    return customApiResponseWithPagination({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Agents retrieved successfully',
      data: result.data,
      pagination: result.meta,
    });
  }
);

import { getAdminUserDetailService, impersonateUserService, toggleUserBanService, sendNotificationService } from '../services/adminUsers.service';
import { ParsedEnvVariables } from '../configs';

export const toggleBanAgentController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const user = await toggleUserBanService(username, 'AGENT');
    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: `User ${user.isActive ? 'unbanned' : 'banned'} successfully`,
      data: user,
    });
  }
);

export const sendNotificationAgentController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const { title, message } = req.body;
    const notification = await sendNotificationService(username, 'AGENT', title, message);
    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.CREATED,
      message: 'Notification sent successfully',
      data: notification,
    });
  }
);

export const impersonateAgentController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const { user, token } = await impersonateUserService(username, 'AGENT');

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

        export const getAgentDetailController = customAsyncWrapper(
          async (req: Request, res: Response) => {
            const { username } = req.params;
            const data = await getAdminUserDetailService(username, 'AGENT');
            if (!data) {
              return customApiResponse({
                response: res,
                statusCode: 404,
                message: 'Agent not found',
                data: null,
              });
            }
            return customApiResponse({
              response: res,
              statusCode: HttpStatusCode.OK,
              message: 'Agent detail retrieved successfully',
              data,
            });
          }
        );

        export const resetAgentPasswordController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const agentId = req.params.id as string;
    const { newPassword } = req.body;

    await resetAgentPasswordService(agentId, newPassword);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Agent password reset successfully',
    });
  }
);
