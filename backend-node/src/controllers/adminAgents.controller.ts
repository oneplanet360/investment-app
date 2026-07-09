import { Request, Response } from 'express';
import { customApiResponse, customApiResponseWithPagination, customAsyncWrapper } from '../utils';
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
