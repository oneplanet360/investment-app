import DepositTable from "../../../components/common/deposit-table";

export default function RejectedDeposits() {
  return <DepositTable title="Rejected Deposits" filter={(d) => d.status === "rejected"} />;
}
