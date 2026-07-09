import { Request, Response } from 'express';
import { ParsedEnvVariables } from '../../configs';
import { ApiSuccessMessages, HttpStatusCode } from '../../constants';
import { signInAdminServices } from '../../services/auth.service';
import { customApiResponse, customAsyncWrapper } from '../../utils';
import { adminSignInSchema } from '../../validations/auth.schema';

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
