import { useState } from "react";
import InvestmentTable from "../../../components/common/investment-table";
import { useAdminInvestments } from "../../../services/adminInvestments/adminInvestments.query";

export default function ActiveInvestments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 20;

  const { data, isLoading } = useAdminInvestments(page, perPage, "ACTIVE", search);

  return (
    <InvestmentTable
      title="Active Investments"
      investments={data?.data || []}
      totalPages={data?.pagination?.totalPages || 1}
      currentPage={page}
      totalResults={data?.pagination?.total || 0}
      perPage={perPage}
      searchQuery={search}
      onPageChange={setPage}
      onSearchChange={(s) => { setSearch(s); setPage(1); }}
      isLoading={isLoading}
    />
  );
}
