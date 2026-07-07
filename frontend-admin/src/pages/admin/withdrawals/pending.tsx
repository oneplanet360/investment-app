import WithdrawalTable from "../../../components/common/withdrawal-table";

export default function PendingWithdrawals() {
  return <WithdrawalTable title="Pending Withdrawals" filter={(w) => w.status === "pending"} />;
}
