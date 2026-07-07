import InvestmentTable from "../../components/common/investment-table";

export default function ActiveInvestments() {
  return <InvestmentTable title="Active Investments" filter={(inv) => inv.status === "active"} />;
}
