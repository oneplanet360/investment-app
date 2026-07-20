import { Network, User } from "lucide-react";
import { useClientAgentTreeQuery } from "../../../services/client/clientAgent/clientAgent.queries";

import type { IAgent } from "../../../types";

type AgentTreeNode = IAgent & {
  subAgents?: AgentTreeNode[];
  investors?: IAgent[];
};

type FlatTableRow = {
  _id: string;
  name: string;
  username: string;
  level?: number;
  type: "Agent" | "Investor";
  sponsor: string | null;
};

// Helper function to flatten the tree
const flattenTree = (node: AgentTreeNode, sponsorUsername: string | null = null): FlatTableRow[] => {
  let rows: FlatTableRow[] = [];
  
  const isInvestor = !node.level;
  
  rows.push({
    _id: node._id,
    name: node.name,
    username: node.username,
    level: node.level,
    type: isInvestor ? "Investor" : "Agent",
    sponsor: sponsorUsername,
  });

  if (node.subAgents && node.subAgents.length > 0) {
    node.subAgents.forEach((child) => {
      rows = rows.concat(flattenTree(child, node.username));
    });
  }

  if (node.investors && node.investors.length > 0) {
    node.investors.forEach((inv) => {
      rows = rows.concat(flattenTree(inv as AgentTreeNode, node.username));
    });
  }

  return rows;
};

export default function GenealogyTree() {
  const { data: tree, isLoading } = useClientAgentTreeQuery();

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-client-text-secondary">Loading genealogy tree...</p>
      </div>
    );
  }

  const flatRows = tree ? flattenTree(tree) : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-client-bg-secondary flex items-center justify-center text-brand-primary">
          <Network size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-client-text tracking-tight">
            Genealogy Tree
          </h1>
          <p className="text-sm text-client-text-secondary">
            View your entire downline and investors
          </p>
        </div>
      </div>

      <div className="bg-client-card border border-client-border rounded-2xl overflow-hidden">
        {flatRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-client-text-secondary">
              <thead className="text-xs uppercase bg-client-bg-secondary text-brand-primary font-semibold border-b border-client-border">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role / Level</th>
                  <th className="px-6 py-4">Sponsor (Upline)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-client-border">
                {flatRows.map((row, idx) => (
                  <tr key={row._id} className="hover:bg-client-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-client-bg-secondary text-brand-primary">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-client-text">
                            {row.name} {idx === 0 && "(You)"}
                          </p>
                          <p className="text-xs text-client-text-secondary mt-0.5">
                            @{row.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${
                          row.type === "Agent"
                            ? "bg-brand-primary/20 text-brand-primary"
                            : "bg-client-bg-secondary text-brand-primary/80"
                        }`}
                      >
                        {row.type === "Agent" ? `Agent - Level ${row.level}` : "Investor"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {row.sponsor ? (
                        <span className="text-client-text font-medium">@{row.sponsor}</span>
                      ) : (
                        <span className="text-client-text-secondary italic">Root Agent</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-client-text-secondary">Tree not available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
