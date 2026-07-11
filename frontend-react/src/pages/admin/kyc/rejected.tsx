import { useState, useEffect } from "react";
import KycTable from "../../../components/common/kyc-table";
import { useKycSubmissionsQuery } from "../../../services/admin/adminKyc/adminKyc.query";

export default function RejectedKyc() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useKycSubmissionsQuery(
    page,
    20,
    "REJECTED",
    debouncedSearch,
  );

  const kycData = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 1 };

  return (
    <KycTable
      title="Rejected KYC Submissions"
      data={kycData}
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
