import { useState } from "react";

import { useAdminInvestments } from "../../../services/admin/adminInvestments/adminInvestments.query";
import InvestmentTable from "../../../components/admin/investment-table";

export default function AllInvestments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 20;

  const { data, isLoading } = useAdminInvestments(page, perPage, "all", search);

  return (
    <InvestmentTable
      title="All Investments"
      investments={data?.data || []}
      totalPages={data?.pagination?.totalPages || 1}
      currentPage={page}
      totalResults={data?.pagination?.total || 0}
      perPage={perPage}
      searchQuery={search}
      onPageChange={setPage}
      onSearchChange={(s) => {
        setSearch(s);
        setPage(1);
      }}
      isLoading={isLoading}
    />
  );
}
