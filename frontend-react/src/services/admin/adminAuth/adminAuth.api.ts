import { axiosInstance } from "../../../lib/axios";
import type { ApiResponse, IAdmin } from "../../../types";
import type { AdminSignInSchemaType } from "./adminAuth.types";

const ADMIN_AUTH_URL = `/auth/admin`;

export const adminSignInApi = async (
  data: AdminSignInSchemaType,
): Promise<ApiResponse<IAdmin>> => {
  const response = await axiosInstance.post<ApiResponse<IAdmin>>(
    `${ADMIN_AUTH_URL}/sign-in`,
    data,
  );
  return response.data;
};

export const adminSignOutApi = async () => {
  const response = await axiosInstance.post<ApiResponse<null>>(
    "/auth/admin/sign-out",
  );
  return response.data;
};

export const adminVerifyUserApi = async () => {
  const response =
    await axiosInstance.get<ApiResponse<IAdmin>>("/auth/admin/verify");
  return response.data;
};
