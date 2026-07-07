import DepositTable from "../../../components/common/deposit-table";

export default function InitiatedDeposits() {
  return <DepositTable title="Initiated Deposits" filter={(d) => d.status === "initiated"} />;
}
