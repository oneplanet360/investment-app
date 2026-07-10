import { axiosInstance } from "../../../lib/axios";
import type { ClientSignInSchemaType, IClientUser, IApiResponse } from "./clientAuth.types";

export const clientSignInApi = async (data: ClientSignInSchemaType) => {
  const response = await axiosInstance.post<IApiResponse<IClientUser>>(
    "/auth/client/sign-in",
    data,
  );
  return response.data;
};

export const clientSignOutApi = async () => {
  const response = await axiosInstance.post<IApiResponse<null>>(
    "/auth/client/sign-out",
  );
  return response.data;
};

export const clientVerifyUserApi = async () => {
  const response = await axiosInstance.get<IApiResponse<IClientUser>>(
    "/auth/client/verify"
  );
  return response.data;
};
