import { useState } from "react";
import DepositTable from "../../../components/common/deposit-table";
import { useAdminDeposits } from "../../../services/adminDeposits/adminDeposits.query";

export default function RejectedDeposits() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 20;

  const { data, isLoading } = useAdminDeposits(page, perPage, "REJECTED", search);

  return (
    <DepositTable
      title="Rejected Deposits"
      deposits={data?.data || []}
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
