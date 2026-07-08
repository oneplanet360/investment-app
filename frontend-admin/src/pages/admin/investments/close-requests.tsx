import InvestmentTable from "../../components/common/investment-table";

export default function CloseRequests() {
  return (
    <InvestmentTable
      title="Close Requests"
      filter={(inv) => inv.closeRequestedAt !== undefined}
    />
  );
}
