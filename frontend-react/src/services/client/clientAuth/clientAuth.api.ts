import { axiosInstance } from "../../../lib/axios";
import type { ApiResponse, IUser } from "../../../types";
import type { ClientSignInSchemaType } from "./clientAuth.types";

const CLIENT_AUTH_URL = `/auth/client`;

export const clientLoginFn = async (
  payload: ClientSignInSchemaType,
): Promise<ApiResponse<{ token: string; user: IUser }>> => {
  const response = await axiosInstance.post(
    `${CLIENT_AUTH_URL}/login`,
    payload,
  );
  return response.data;
};

export const clientRegisterFn = async (
  payload: Record<string, unknown>,
): Promise<ApiResponse<{ token: string; user: IUser }>> => {
  const response = await axiosInstance.post(
    `${CLIENT_AUTH_URL}/register`,
    payload,
  );
  return response.data;
};

export const clientSignOutApi = async (): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.post<ApiResponse<null>>(
    "/auth/client/sign-out",
  );
  return response.data;
};

export const clientVerifyUserApi = async (): Promise<ApiResponse<IUser>> => {
  const response = await axiosInstance.get<ApiResponse<IUser>>(
    "/auth/client/verify",
  );
  return response.data;
};
