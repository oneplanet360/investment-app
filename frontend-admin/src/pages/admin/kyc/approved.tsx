import KycTable from "../../../components/common/kyc-table";
export default function ApprovedKyc() {
  return <KycTable title="Approved KYC" filter={(k) => k.status === "approved"} />;
}
