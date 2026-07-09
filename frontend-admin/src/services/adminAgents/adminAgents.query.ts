import { useQuery } from "@tanstack/react-query";
import { getAgentsFn } from "./adminAgents.api";

export const useAgentsQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ["admin-agents", page, limit, search],
    queryFn: () => getAgentsFn(page, limit, search),
  });
};

export const useAdminAgentDetail = (username: string, options?: any) => {
  return useQuery({
    queryKey: ["adminAgentDetail", username],
    queryFn: () => getAdminAgentDetailApi(username),
    ...options
  });
};
