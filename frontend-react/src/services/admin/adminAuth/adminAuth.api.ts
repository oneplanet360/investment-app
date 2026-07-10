import { axiosInstance } from "../../../lib/axios";
import type {
  AdminSignInSchemaType,
  IAdmin,
  IApiResponse,
} from "./adminAuth.types";

export const adminSignInApi = async (data: AdminSignInSchemaType) => {
  const response = await axiosInstance.post<IApiResponse<IAdmin>>(
    "/auth/admin/sign-in",
    data,
  );
  return response.data;
};

export const adminSignOutApi = async () => {
  const response = await axiosInstance.post<IApiResponse<null>>(
    "/auth/admin/sign-out",
  );
  return response.data;
};

export const adminVerifyUserApi = async () => {
  const response =
    await axiosInstance.get<IApiResponse<IAdmin>>("/auth/admin/verify");
  return response.data;
};
