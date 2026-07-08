import InvestmentTable from "../../../components/common/investment-table";

export default function ClosedInvestments() {
  return <InvestmentTable title="Closed Investments" filter={(inv) => inv.status === "closed"} />;
}
