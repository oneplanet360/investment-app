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
    const user = await toggleUserBanService(username as string, 'AGENT');
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
    const notification = await sendNotificationService(username as string, 'AGENT', title, message);
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
    const { user, token } = await impersonateUserService(username as string, 'AGENT');

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
            const data = await getAdminUserDetailService(username as string, 'AGENT');
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

import { Agent, Investor, User } from '../database/models/user.model';
import { customError } from '../utils';

export const getAgentTreeAdminController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    const getDownline = async (agentId: string, currentLevel: number): Promise<any> => {
      if (currentLevel >= 4) {
        const investors = await Investor.find({ referredBy: agentId }).select('name username email kycStatus createdAt');
        return investors;
      }

      const subAgents = await User.find({ sponsor: agentId }).select('name username email level kycStatus createdAt');
      const downline = [];
      for (const sub of subAgents) {
        const subAgentData = sub.toObject() as any;
        const children = await getDownline(sub._id.toString(), subAgentData.level);
        if (subAgentData.level === 4) {
          (subAgentData as any).investors = children;
        } else {
          (subAgentData as any).subAgents = children;
        }
        downline.push(subAgentData);
      }
      return downline;
    };

    const rootAgent = await User.findOne({ username }).select('name username email level kycStatus createdAt');
    if (!rootAgent) throw new customError('Agent not found', 404);

    const tree = rootAgent.toObject() as any;
    const children = await getDownline(rootAgent._id.toString(), tree.level);
    if (tree.level === 4) {
      (tree as any).investors = children;
    } else {
      (tree as any).subAgents = children;
    }

    res.status(HttpStatusCode.OK).json({
      success: true,
      tree,
    });
  }
);
