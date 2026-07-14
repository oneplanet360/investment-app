import { useState } from "react";
import { Network, User, Search } from "lucide-react";
import { useAdminAgentTreeQuery } from "../../../services/admin/adminAgents/adminAgents.query";

type AgentTreeNode = any;

const treeStyles = `
.org-tree ul {
  padding-top: 20px; 
  position: relative;
  display: flex; 
  justify-content: center;
  padding-left: 0;
}
.org-tree li {
  text-align: center;
  list-style-type: none;
  position: relative;
  padding: 20px 5px 0 5px;
}
/* Connectors */
.org-tree li::before, .org-tree li::after {
  content: '';
  position: absolute; top: 0; right: 50%;
  border-top: 2px solid #e5e7eb;
  width: 50%; height: 20px;
}
.org-tree li::after {
  right: auto; left: 50%;
  border-left: 2px solid #e5e7eb;
}
.org-tree li:only-child::after, .org-tree li:only-child::before {
  display: none;
}
.org-tree li:only-child { padding-top: 0; }
.org-tree li:first-child::before, .org-tree li:last-child::after {
  border: 0 none;
}
.org-tree li:last-child::before {
  border-right: 2px solid #e5e7eb;
  border-radius: 0 5px 0 0;
}
.org-tree li:first-child::after {
  border-radius: 5px 0 0 0;
}
.org-tree ul ul::before {
  content: '';
  position: absolute; top: 0; left: 50%;
  border-left: 2px solid #e5e7eb;
  width: 0; height: 20px;
  transform: translateX(-50%);
}
`;

const OrgTreeNode = ({ node, isRoot = false }: { node: AgentTreeNode; isRoot?: boolean }) => {
  const isInvestor = !node.level;
  const children = [...(node.subAgents || []), ...(node.investors || [])];

  return (
    <li>
      <div
        className={`inline-block mx-2 flex-col items-center justify-center p-4 w-48 rounded-xl border shadow-sm transition-transform hover:-translate-y-1 ${
          isRoot 
            ? "bg-white border-orange-300 ring-2 ring-orange-100 shadow-orange-100" 
            : isInvestor 
              ? "bg-white border-indigo-100 shadow-indigo-50" 
              : "bg-white border-orange-100 shadow-orange-50"
        }`}
        style={{ display: "inline-flex" }}
      >
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-inner ${
            isRoot 
              ? "bg-orange-500 text-white" 
              : isInvestor 
                ? "bg-indigo-50 text-indigo-600" 
                : "bg-orange-50 text-orange-600"
          }`}
        >
          <User size={24} />
        </div>
        <h4 className={`text-sm font-bold truncate w-full text-center ${isRoot ? "text-gray-900" : "text-gray-800"}`}>
          {node.name} {isRoot && "(You)"}
        </h4>
        <span className="text-xs text-gray-500 truncate w-full text-center mt-0.5">@{node.username}</span>
        <span
          className={`mt-3 text-[10px] px-2 py-1 rounded-full font-bold tracking-wide uppercase ${
            isRoot
              ? "bg-orange-100 text-orange-700"
              : isInvestor 
                ? "bg-indigo-50 text-indigo-600 border border-indigo-100" 
                : "bg-orange-50 text-orange-600 border border-orange-100"
          }`}
        >
          {isInvestor ? "Investor" : `Level ${node.level}`}
        </span>
      </div>
      
      {children.length > 0 && (
        <ul>
          {children.map((child: any) => (
            <OrgTreeNode key={child._id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function AdminGenealogyTree() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tree, isLoading, isError, error } = useAdminAgentTreeQuery(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm.trim());
  };

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 space-y-6">
      <style>{treeStyles}</style>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Network size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-700">
              Genealogy Tree
            </h1>
            <p className="text-sm text-gray-500">
              View agent downline and investors
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex items-center max-w-xs w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by agent username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm overflow-x-auto min-h-[500px]">
        {!searchQuery ? (
           <div className="flex flex-col items-center justify-center h-full pt-24">
             <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
               <Network size={32} className="text-gray-400" />
             </div>
             <h3 className="text-gray-900 font-medium mb-1">Search for an Agent</h3>
             <p className="text-gray-500 text-sm">Enter an agent's username above to view their genealogy tree.</p>
           </div>
        ) : isLoading ? (
          <div className="flex flex-col justify-center items-center h-full pt-32 gap-3">
            <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading network...</p>
          </div>
        ) : isError ? (
           <div className="flex justify-center items-center h-full pt-20">
             <div className="bg-red-50 px-6 py-4 rounded-xl border border-red-100 max-w-md text-center">
               <p className="text-red-600 font-medium">
                 {(error as any)?.response?.data?.message || "Failed to load agent tree. Please check the username."}
               </p>
             </div>
           </div>
        ) : tree ? (
          <div className="org-tree inline-block min-w-full text-center pb-8 pt-4">
            <ul className="!pt-0">
              <OrgTreeNode node={tree} isRoot={true} />
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
