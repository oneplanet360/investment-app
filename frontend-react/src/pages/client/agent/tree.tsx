import { Network, User } from "lucide-react";
import { useClientAgentTreeQuery } from "../../../services/client/clientAgent/clientAgent.queries";

import type { IAgent } from "../../../types";

type AgentTreeNode = IAgent & {
  subAgents?: AgentTreeNode[];
  investors?: IAgent[];
};

const TreeNode = ({ node }: { node: AgentTreeNode }) => {
  const isInvestor = !node.level;

  return (
    <div className="ml-6 relative">
      {/* Connector lines */}
      <div className="absolute -left-6 top-5 w-6 border-b border-zinc-700"></div>
      <div className="absolute -left-6 top-0 h-full border-l border-zinc-700"></div>

      <div
        className={`mt-3 flex items-center gap-3 p-3 rounded-xl border ${isInvestor ? "bg-[#18181b] border-indigo-500/20" : "bg-[#141414] border-orange-500/20"}`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${isInvestor ? "bg-indigo-500/10 text-indigo-400" : "bg-orange-500/10 text-orange-500"}`}
        >
          <User size={16} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">{node.name}</h4>
          <div className="flex gap-2 items-center mt-0.5">
            <span className="text-xs text-zinc-500">@{node.username}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${isInvestor ? "bg-indigo-500/10 text-indigo-400" : "bg-orange-500/10 text-orange-400"}`}
            >
              {isInvestor ? "Investor" : `Level ${node.level}`}
            </span>
          </div>
        </div>
      </div>

      {node.subAgents && node.subAgents.length > 0 && (
        <div className="mt-2">
          {node.subAgents.map((child: AgentTreeNode) => (
            <TreeNode key={child._id} node={child} />
          ))}
        </div>
      )}

      {node.investors && node.investors.length > 0 && (
        <div className="mt-2">
          {node.investors.map((inv: AgentTreeNode) => (
            <TreeNode key={inv._id} node={inv} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function GenealogyTree() {
  const { data: tree, isLoading } = useClientAgentTreeQuery();

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-zinc-500">Loading genealogy tree...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
          <Network size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Genealogy Tree
          </h1>
          <p className="text-sm text-zinc-400">
            View your entire downline and investors
          </p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-2xl p-6 overflow-x-auto custom-scrollbar">
        {tree ? (
          <div className="min-w-max pb-4">
            {/* Root Node (Current User) */}
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-[#141414] border-orange-500/30">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {tree.name} (You)
                </h3>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-xs text-zinc-400">
                    @{tree.username}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/20">
                    Level {tree.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Children */}
            <div className="mt-4">
              {tree.subAgents?.map((child: AgentTreeNode) => (
                <TreeNode key={child._id} node={child} />
              ))}
              {tree.investors?.map((inv: AgentTreeNode) => (
                <TreeNode key={inv._id} node={inv} />
              ))}

              {(!tree.subAgents || tree.subAgents.length === 0) &&
                (!tree.investors || tree.investors.length === 0) && (
                  <div className="pl-6 pt-4 text-sm text-zinc-500 border-l border-zinc-700 ml-5 h-8">
                    <div className="absolute w-4 border-b border-zinc-700 mt-2.5 -ml-6"></div>
                    No downline found.
                  </div>
                )}
            </div>
          </div>
        ) : (
          <p className="text-zinc-500">Tree not available.</p>
        )}
      </div>
    </div>
  );
}
