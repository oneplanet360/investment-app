import DepositTable from "../../../components/common/deposit-table";


export default function AllDeposits() {
  return <DepositTable title="Deposit History" filter={() => true} showSummary />;
}
