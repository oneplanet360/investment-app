import InvestmentTable from "../../../components/common/investment-table";

export default function CompletedInvestments() {
  return <InvestmentTable title="Completed Investments" filter={(inv) => inv.status === "completed"} />;
}
