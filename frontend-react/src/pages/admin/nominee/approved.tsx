import { useState, useEffect } from "react";
import NomineeTable from "../../../components/admin/nominee-table";
import { useAdminNomineeSubmissionsQuery } from "../../../services/admin/adminNominee/adminNominee.queries";

export default function ApprovedNominee() {
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

  const { data, isLoading } = useAdminNomineeSubmissionsQuery(
    page,
    20,
    "APPROVED",
    debouncedSearch,
  );

  const nomineeData = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 1 };

  return (
    <NomineeTable
      title="Approved Nominee Submissions"
      data={nomineeData}
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
