import { axiosInstance } from "../../../lib/axios";
import type { INominee } from "../../../types";

const CLIENT_NOMINEE_URL = `/client/nominee`;

export const submitClientNomineeFn = async (payload: FormData): Promise<INominee> => {
  const response = await axiosInstance.post(`${CLIENT_NOMINEE_URL}/submit`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getClientNomineeStatusFn = async (): Promise<INominee> => {
  const response = await axiosInstance.get(`${CLIENT_NOMINEE_URL}/status`);
  return response.data.nominee;
};
