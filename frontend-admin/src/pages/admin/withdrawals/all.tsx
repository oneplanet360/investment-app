import WithdrawalTable from "../../../components/common/withdrawal-table";

export default function AllWithdrawals() {
  return <WithdrawalTable title="All Withdrawals" filter={() => true} showSummary />;
}
