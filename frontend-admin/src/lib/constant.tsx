import {
  LayoutDashboard,
  UserCog,
  Package,
  TrendingUp,
  Wallet,
  Landmark,
  FileText,
  ShieldCheck,
  Bell,
  Settings,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export type SidebarMenuItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
  children?: { label: string; href: string }[];
};

export const sidebarMenu: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Member Management",
    icon: UserCog,
    children: [
      { label: "All Members", href: "/members" },
      { label: "Add Member", href: "/members/add" },
      { label: "Sponsor Details", href: "/members/sponsor-details" },
      { label: "Reset Password", href: "/members/reset-password" },
      { label: "Genealogy Tree", href: "/members/genealogy" },
    ],
  },
  {
    label: "Package Management",
    icon: Package,
    children: [
      { label: "Create Packages", href: "/packages" },
      { label: "Assign / Upgrade", href: "/packages/assign" },
    ],
  },
  {
    label: "Income Management",
    icon: TrendingUp,
    children: [
      { label: "Direct Referral Bonus", href: "/income/direct-referral" },
      { label: "Level Income", href: "/income/level-income" },
      { label: "Manual Credit / Debit", href: "/income/manual-credit" },
      { label: "Income History", href: "/income/history" },
    ],
  },
  {
    label: "Wallet Management",
    icon: Wallet,
    children: [
      { label: "Wallet Balance", href: "/wallet/balance" },
      { label: "Fund Credit / Debit", href: "/wallet/fund-credit" },
      { label: "Wallet Transactions", href: "/wallet/transactions" },
    ],
  },
  {
    label: "Withdrawal Management",
    icon: Landmark,
    children: [
      { label: "Pending Withdrawals", href: "/withdrawals/pending" },
      { label: "Approved Withdrawals", href: "/withdrawals/approved" },
      { label: "Rejected Withdrawals", href: "/withdrawals/rejected" },
      { label: "All Withdrawals", href: "/withdrawals/all" },
    ],
  },
  {
    label: "Reports",
    icon: FileText,
    children: [
      { label: "Member Report", href: "/reports/members" },
      { label: "Income Report", href: "/reports/income" },
      { label: "Business Report", href: "/reports/business" },
      { label: "Package Report", href: "/reports/packages" },
      { label: "Withdrawal Report", href: "/reports/withdrawals" },
      { label: "Transaction History", href: "/reports/transactions" },
      { label: "Login History", href: "/reports/login" },
      { label: "Export Reports", href: "/reports/export" },
    ],
  },
  {
    label: "KYC",
    icon: ShieldCheck,
    children: [
      { label: "Document Verification", href: "/kyc/documents" },
      { label: "Bank Details", href: "/kyc/bank-details" },
      { label: "PAN / Aadhaar", href: "/kyc/pan-aadhaar" },
    ],
  },
  {
    label: "Communication",
    icon: Bell,
    children: [
      { label: "Send Notifications", href: "/communication/notifications" },
      { label: "Announcements", href: "/communication/announcements" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Company Information", href: "/settings/company" },
      { label: "Level Commission", href: "/settings/level-commission" },
      { label: "Withdrawal Settings", href: "/settings/withdrawal" },
      { label: "Payment Gateway", href: "/settings/payment-gateway" },
      { label: "System Setting", href: "/settings/system" },
    ],
  },
  {
    label: "Admin & Security",
    icon: ShieldAlert,
    children: [
      { label: "Admin Users & Roles", href: "/admin/users" },
      { label: "Activity Logs", href: "/admin/activity-logs" },
      { label: "Login History", href: "/admin/login-history" },
      { label: "Backup & Restore", href: "/admin/backup" },
    ],
  },
];