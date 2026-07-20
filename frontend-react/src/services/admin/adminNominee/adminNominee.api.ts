import { axiosInstance } from "../../../lib/axios";
import type { INominee, NomineeListResponse } from "./adminNominee.types.ts";

const ADMIN_NOMINEE_URL = `/admin/nominee`;

export const getNomineeSubmissionsFn = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search: string = "",
): Promise<NomineeListResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (status) {
    params.append("status", status.toUpperCase());
  }
  if (search) {
    params.append("search", search);
  }

  const response = await axiosInstance.get(
    `${ADMIN_NOMINEE_URL}?${params.toString()}`,
  );
  return { data: response.data.data, meta: response.data.meta };
};

export const getNomineeDetailFn = async (id: string): Promise<INominee> => {
  const response = await axiosInstance.get(`${ADMIN_NOMINEE_URL}/${id}`);
  return response.data.data;
};

export const updateNomineeStatusFn = async ({
  id,
  status,
  remarks,
}: {
  id: string;
  status: "APPROVED" | "REJECTED";
  remarks?: string;
}): Promise<INominee> => {
  const response = await axiosInstance.put(`${ADMIN_NOMINEE_URL}/${id}/status`, {
    status,
    adminRemarks: remarks,
  });
  return response.data.data;
};
