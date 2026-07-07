import DepositTable from "../../../components/common/deposit-table";

export default function SuccessfulDeposits() {
  return <DepositTable title="Successful Deposits" filter={(d) => d.status === "successful"} />;
}
