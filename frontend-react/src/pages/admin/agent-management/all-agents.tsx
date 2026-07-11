import { useState, useEffect } from "react";

import { useAgentsQuery } from "../../../services/admin/adminAgents/adminAgents.query";
import AgentsTable from "../../../components/admin/agent-table";

export default function AllAgents() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useAgentsQuery(page, 20, debouncedSearch);

  const agents = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 1 };

  return (
    <AgentsTable
      title="All Agents"
      agents={agents}
      totalPages={meta.totalPages}
      currentPage={meta.page}
      totalResults={meta.total}
      perPage={meta.limit}
      searchQuery={search}
      onPageChange={setPage}
      onSearchChange={setSearch}
      isLoading={isLoading}
    />
  );
}
