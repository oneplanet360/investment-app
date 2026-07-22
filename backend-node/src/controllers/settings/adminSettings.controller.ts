import { Request, Response } from 'express';
import { customAsyncWrapper } from '../../utils/custom.asyncWrapper';
import { customApiResponse } from '../../utils/custom.response';
import { HttpStatusCode } from '../../constants';
import {
  getAdminSettingsService,
  updateAdminSettingsService,
} from '../../services/adminSettings.service';
import { Setting } from '../../database/models/setting.model';

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

export const getInvestmentSettings = customAsyncWrapper(
  async (req: Request, res: Response) => {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investment settings fetched successfully',
      data: settings,
    });
  }
);

export const updateInvestmentSettings = customAsyncWrapper(
  async (req: Request, res: Response) => {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings.set(req.body);
      await settings.save();
    }

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Investment settings updated successfully',
      data: settings,
    });
  }
);
