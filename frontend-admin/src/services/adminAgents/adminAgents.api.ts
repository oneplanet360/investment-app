import { axiosInstance } from "../../lib/axios";
import type { IAgent, AgentPayload, AgentListResponse } from "./adminAgents.types";

const ADMIN_AGENTS_URL = `/agents`;

export const createAgentFn = async (payload: AgentPayload): Promise<IAgent> => {
  const response = await axiosInstance.post(ADMIN_AGENTS_URL, payload);
  return response.data.data;
};

export const getAgentsFn = async (
  page: number = 1,
  limit: number = 20,
  search: string = ""
): Promise<AgentListResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) {
    params.append("search", search);
  }
  
  const response = await axiosInstance.get(`${ADMIN_AGENTS_URL}?${params.toString()}`);
  return { data: response.data.data, meta: response.data.meta };
};

export const resetAgentPasswordFn = async ({
  agentId,
  newPassword,
}: {
  agentId: string;
  newPassword?: string;
}): Promise<void> => {
  await axiosInstance.put(`${ADMIN_AGENTS_URL}/${agentId}/password-reset`, { newPassword });
};
