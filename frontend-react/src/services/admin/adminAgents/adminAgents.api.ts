import { axiosInstance } from "../../../lib/axios";
import type {
  IAgent,
  AgentPayload,
  AgentListResponse,
} from "./adminAgents.types";

const ADMIN_AGENTS_URL = `/agents`;

export const createAgentFn = async (payload: AgentPayload): Promise<IAgent> => {
  const response = await axiosInstance.post(ADMIN_AGENTS_URL, payload);
  return response.data.data;
};

export const getAgentsFn = async (
  page: number = 1,
  limit: number = 20,
  search: string = "",
): Promise<AgentListResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) {
    params.append("search", search);
  }

  const response = await axiosInstance.get(
    `${ADMIN_AGENTS_URL}?${params.toString()}`,
  );
  return { data: response.data.data, meta: response.data.meta };
};

export const resetAgentPasswordFn = async ({
  agentId,
  newPassword,
}: {
  agentId: string;
  newPassword?: string;
}): Promise<void> => {
  await axiosInstance.put(`${ADMIN_AGENTS_URL}/${agentId}/password-reset`, {
    newPassword,
  });
};

import type { IUserDetailResponse } from "../adminUsers.types";
export const getAdminAgentDetailApi = async (
  username: string,
): Promise<IUserDetailResponse> => {
  const { data } = await axiosInstance.get(`/agents/${username}`);
  return data.data;
};

export const impersonateAgentApi = async (username: string) => {
  const { data } = await axiosInstance.post(`/agents/${username}/impersonate`);
  return data;
};

export const toggleBanAgentApi = async (username: string) => {
  const { data } = await axiosInstance.put(`/agents/${username}/ban`);
  return data;
};

export const sendNotificationAgentApi = async ({
  username,
  title,
  message,
}: {
  username: string;
  title: string;
  message: string;
}) => {
  const { data } = await axiosInstance.post(
    `/agents/${username}/notification`,
    { title, message },
  );
  return data;
};

export const getAdminAgentTreeFn = async (username: string): Promise<IAgent & { subAgents?: IAgent[]; investors?: IAgent[] }> => {
  const { data } = await axiosInstance.get(`/agents/${username}/tree`);
  return data.tree;
};
