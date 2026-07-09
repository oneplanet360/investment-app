import { Request, Response } from 'express';

import { customApiResponse, customAsyncWrapper } from '../utils';
import { HttpStatusCode } from '../constants';
import {
  getAdminProfileService,
  updateAdminPasswordService,
  updateAdminProfileService,
} from '../services/adminProfile.service';

export const getAdminProfileController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const adminId = req.admin!._id.toString();
    const profile = await getAdminProfileService(adminId);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Admin profile fetched successfully',
      data: profile,
    });
  }
);

export const updateAdminProfileController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const adminId = req.admin!._id.toString();
    const profile = await updateAdminProfileService(adminId, req.body);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Admin profile updated successfully',
      data: profile,
    });
  }
);

export const updateAdminPasswordController = customAsyncWrapper(
  async (req: Request, res: Response) => {
    const adminId = req.admin!._id.toString();
    await updateAdminPasswordService(adminId, req.body);

    return customApiResponse({
      response: res,
      statusCode: HttpStatusCode.OK,
      message: 'Password updated successfully',
    });
  }
);
