import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ParsedEnvVariables } from '../configs';
import { ApiErrorMessages, HttpStatusCode } from '../constants';
import { Admin } from '../database/models/admin.model';
import { customError } from '../utils';
import { customAsyncWrapper } from '../utils/custom.asyncWrapper';

export const adminAuthMiddleware = customAsyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new customError(
        'Not authorized, no token',
        HttpStatusCode.UNAUTHORIZED
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        ParsedEnvVariables.ACCESS_TOKEN_SECRET
      ) as { _id: string };

      const currentAdmin = await Admin.findById(decoded._id).select(
        '-password'
      );

      if (!currentAdmin) {
        throw new customError(
          ApiErrorMessages.ADMIN_NOT_FOUND || 'Admin not found',
          HttpStatusCode.UNAUTHORIZED
        );
      }

      req.admin = currentAdmin;
      next();
    } catch {
      throw new customError(
        'Not authorized, token failed',
        HttpStatusCode.UNAUTHORIZED
      );
    }
  }
);
