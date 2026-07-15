import { Request, Response } from 'express';
import { ParsedEnvVariables } from '../../configs';
import { ApiSuccessMessages, HttpStatusCode } from '../../constants';
import {
  signInAdminServices,
  signInClientServices,
  impersonateClientService,
} from '../../services/auth.service';
import { customApiResponse, customAsyncWrapper } from '../../utils';
import {
  adminSignInSchema,
  clientSignInSchema,
} from '../../validations/auth.schema';

export const signInAdminController = customAsyncWrapper(
  async (request: Request, response: Response) => {
    const body = adminSignInSchema.parse(request.body);

    const { admin, token } = await signInAdminServices(body);

    const cookieMaxAge = 24 * 60 * 60 * 1000;

    response.cookie('accessToken', token, {
      httpOnly: true,
      secure: ParsedEnvVariables.NODE_ENV === 'production',
      sameSite:
        ParsedEnvVariables.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: cookieMaxAge,
    });

    customApiResponse({
      response,
      statusCode: HttpStatusCode.OK,
      message: ApiSuccessMessages.SIGN_IN_SUCCESS,
      data: admin,
    });
  }
);

export const signOutAdminController = customAsyncWrapper(
  async (request: Request, response: Response) => {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: ParsedEnvVariables.NODE_ENV === 'production',
      sameSite:
        ParsedEnvVariables.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    customApiResponse({
      response,
      statusCode: HttpStatusCode.OK,
      message: ApiSuccessMessages.SIGN_OUT_SUCCESS || 'Sign out successfully',
      data: null,
    });
  }
);

export const verifyController = customAsyncWrapper(
  async (request: Request, response: Response) => {
    const admin = request?.admin;

    customApiResponse({
      response,
      statusCode: HttpStatusCode.OK,
      data: admin,
    });
  }
);

export const signInClientController = customAsyncWrapper(
  async (request: Request, response: Response) => {
    const body = clientSignInSchema.parse(request.body);

    const { user, token } = await signInClientServices(body);

    const cookieMaxAge = 24 * 60 * 60 * 1000;

    response.cookie('clientAccessToken', token, {
      httpOnly: true,
      secure: ParsedEnvVariables.NODE_ENV === 'production',
      sameSite:
        ParsedEnvVariables.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: cookieMaxAge,
    });

    customApiResponse({
      response,
      statusCode: HttpStatusCode.OK,
      message: ApiSuccessMessages.SIGN_IN_SUCCESS,
      data: user,
    });
  }
);

export const signOutClientController = customAsyncWrapper(
  async (request: Request, response: Response) => {
    response.clearCookie('clientAccessToken', {
      httpOnly: true,
      secure: ParsedEnvVariables.NODE_ENV === 'production',
      sameSite:
        ParsedEnvVariables.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    customApiResponse({
      response,
      statusCode: HttpStatusCode.OK,
      message: ApiSuccessMessages.SIGN_OUT_SUCCESS || 'Sign out successfully',
      data: null,
    });
  }
);

export const verifyClientController = customAsyncWrapper(
  async (request: Request, response: Response) => {
    const user = (request as any).user;

    customApiResponse({
      response,
      statusCode: HttpStatusCode.OK,
      data: user,
    });
  }
);

export const adminImpersonateUserController = customAsyncWrapper(
  async (request: Request, response: Response) => {
    const { userId } = request.body;

    if (!userId) {
      return response.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: 'userId is required',
      });
    }

    const { user, token } = await impersonateClientService(userId);

    const cookieMaxAge = 1 * 60 * 60 * 1000; // 1 hour for impersonation

    response.cookie('clientAccessToken', token, {
      httpOnly: true,
      secure: ParsedEnvVariables.NODE_ENV === 'production',
      sameSite:
        ParsedEnvVariables.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: cookieMaxAge,
    });

    customApiResponse({
      response,
      statusCode: HttpStatusCode.OK,
      message: 'Impersonation successful',
      data: user,
    });
  }
);
