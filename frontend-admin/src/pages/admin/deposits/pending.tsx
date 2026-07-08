import DepositTable from "../../../components/common/deposit-table";

export default function PendingDeposits() {
  return <DepositTable title="Pending Deposits" filter={(d) => d.status === "pending"} />;
}
