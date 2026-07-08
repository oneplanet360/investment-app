import InvestorsTable from "../../../components/tables/investors-table";

export default function AllInvestors() {
  return (
    <InvestorsTable 
      title="All Investors" 
      filter={() => true} 
    />
  );
}
