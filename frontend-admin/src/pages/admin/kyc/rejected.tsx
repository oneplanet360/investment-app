import KycTable from "../../../components/common/kyc-table";
export default function RejectedKyc() {
  return <KycTable title="Rejected KYC" filter={(k) => k.status === "rejected"} />;
}
