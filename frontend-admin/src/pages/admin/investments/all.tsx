import InvestmentTable from "../../../components/common/investment-table";

export default function AllInvestments() {
  return <InvestmentTable title="All Investments" filter={() => true} />;
}
