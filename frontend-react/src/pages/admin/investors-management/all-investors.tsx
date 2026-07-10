import { useState, useEffect } from "react";
import InvestorsTable from "../../../components/tables/investors-table";
import { useInvestorsQuery } from "../../../services/admin/adminInvestors/adminInvestors.query";

export default function AllInvestors() {
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

  const { data, isLoading } = useInvestorsQuery(page, 20, debouncedSearch);

  const investorsData = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, totalPages: 1 };

  return (
    <InvestorsTable 
      title="All Investors" 
      data={investorsData}
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
