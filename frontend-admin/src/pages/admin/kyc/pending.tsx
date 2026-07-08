import KycTable from "../../../components/common/kyc-table";
export default function PendingKyc() {
  return <KycTable title="Pending KYC" filter={(k) => k.status === "pending"} />;
}
