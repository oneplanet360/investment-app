import WithdrawalTable from "../../../components/common/withdrawal-table";


export default function RejectedWithdrawals() {
  return <WithdrawalTable title="Rejected Withdrawals" filter={(w) => w.status === "rejected"} />;
}
