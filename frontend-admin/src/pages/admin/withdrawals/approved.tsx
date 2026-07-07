import WithdrawalTable from "../../../components/common/withdrawal-table";

export default function ApprovedWithdrawals() {
  return <WithdrawalTable title="Approved Withdrawals" filter={(w) => w.status === "approved"} />;
}
