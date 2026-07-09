import { useQuery } from "@tanstack/react-query";
import { getAgentsFn } from "./adminAgents.api";

export const useAgentsQuery = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ["admin-agents", page, limit, search],
    queryFn: () => getAgentsFn(page, limit, search),
  });
};
