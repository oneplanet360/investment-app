import { Request, Response } from 'express';
import { customAsyncWrapper } from '../../utils/custom.asyncWrapper';
import { customApiResponse } from '../../utils/custom.response';
import { HttpStatusCode } from '../../constants';
import {
  getAdminSettingsService,
  updateAdminSettingsService,
} from '../../services/adminSettings.service';

export const getAdminSettings = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const settings = await getAdminSettingsService();

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Admin settings fetched successfully',
      data: settings,
    });
  }
);

export const updateAdminSettings = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const settings = await updateAdminSettingsService(req.body);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Admin settings updated successfully',
      data: settings,
    });
  }
);
