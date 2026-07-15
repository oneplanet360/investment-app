import { axiosInstance } from "../../../lib/axios";
import type { IUser, IAgent, IInvestor } from "../../../types";

const CLIENT_AGENT_URL = `/client/agent`;

export const searchUnassignedUserFn = async (
  username: string,
  targetRole: string,
): Promise<IUser> => {
  const response = await axiosInstance.get(
    `${CLIENT_AGENT_URL}/search-user?username=${username}&targetRole=${targetRole}`,
  );
  return response.data.user;
};

export const assignClientInvestorFn = async (payload: {
  username: string;
}): Promise<IInvestor> => {
  const response = await axiosInstance.post(
    `${CLIENT_AGENT_URL}/assign-investor`,
    payload,
  );
  return response.data.investor;
};

export const createClientInvestorFn = async (payload: any) => {
  const response = await axiosInstance.post(
    `${CLIENT_AGENT_URL}/create-investor`,
    payload,
  );
  return response.data;
};

export const assignClientSubAgentFn = async (payload: {
  username: string;
}): Promise<IAgent> => {
  const response = await axiosInstance.post(
    `${CLIENT_AGENT_URL}/assign-sub-agent`,
    payload,
  );
  return response.data.agent;
};

export const getClientInvestorsFn = async (): Promise<IInvestor[]> => {
  const response = await axiosInstance.get(`${CLIENT_AGENT_URL}/investors`);
  return response.data.investors;
};

export const getClientAgentTreeFn = async (): Promise<
  IAgent & { subAgents?: IAgent[]; investors?: IAgent[] }
> => {
  const response = await axiosInstance.get(`${CLIENT_AGENT_URL}/tree`);
  return response.data.tree;
};

export const getAgentCommissionsFn = async (): Promise<any[]> => {
  const response = await axiosInstance.get(`${CLIENT_AGENT_URL}/commissions`);
  return response.data.commissions;
};

export const getAgentDashboardStatsFn = async (): Promise<any> => {
  const response = await axiosInstance.get(
    `${CLIENT_AGENT_URL}/dashboard-stats`,
  );
  return response.data.stats;
};
