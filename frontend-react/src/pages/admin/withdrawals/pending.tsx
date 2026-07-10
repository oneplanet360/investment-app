import { useState } from "react";
import WithdrawalTable from "../../../components/common/withdrawal-table";
import { useAdminWithdrawals } from "../../../services/admin/adminWithdrawals/adminWithdrawals.query";

export default function PendingWithdrawals() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 20;

  const { data, isLoading } = useAdminWithdrawals(page, perPage, "PENDING", search);

  return (
    <WithdrawalTable
      title="Pending Withdrawals"
      withdrawals={data?.data || []}
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
