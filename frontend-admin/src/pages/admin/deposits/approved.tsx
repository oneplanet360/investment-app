import DepositTable from "../../../components/common/deposit-table";

export default function ApprovedDeposits() {
  return <DepositTable title="Approved Deposits" filter={(d) => d.status === "approved"} />;
}
