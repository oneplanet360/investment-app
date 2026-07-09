import {
  Home,
  Users,
  UserPlus,
  KeyRound,
  TrendingUp,
  Landmark,
  List,
  Clock,
  CheckCircle,
  CheckSquare,
  XCircle,
  PlayCircle,
  ShieldCheck,
  Briefcase,
  ArrowUpCircle,
  ArrowDownCircle,
  Percent,
  Coins,
  PieChart,
  Mail,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type SidebarMenuItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
  children?: { label: string; href: string; icon?: LucideIcon }[];
};

export const sidebarMenu: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "Investments",
    icon: TrendingUp,
    children: [
      { label: "All Investments", href: "/investments", icon: List },
      { label: "Active Investments", href: "/investments/active", icon: CheckCircle },
      { label: "Completed Investments", href: "/investments/completed", icon: CheckSquare },
      { label: "Closed Investments", href: "/investments/closed", icon: XCircle },
      { label: "Close Requests", href: "/investments/close-requests", icon: Clock },
    ],
  },
  {
    label: "Top-ups",
    icon: ArrowUpCircle,
    children: [
      { label: "All Top-ups", href: "/topups", icon: List },
    ],
  },
  {
    label: "Deposits",
    icon: ArrowDownCircle,
    children: [
      { label: "All Deposits", href: "/deposits", icon: List },
      { label: "Pending Deposits", href: "/deposits/pending", icon: Clock },
      { label: "Approved Deposits", href: "/deposits/approved", icon: CheckCircle },
      { label: "Successful Deposits", href: "/deposits/successful", icon: CheckSquare },
      { label: "Rejected Deposits", href: "/deposits/rejected", icon: XCircle },
      { label: "Initiated Deposits", href: "/deposits/initiated", icon: PlayCircle },
    ],
  },
  {
    label: "Withdrawals",
    icon: Landmark,
    children: [
      { label: "All Withdrawals", href: "/withdrawals", icon: List },
      { label: "Pending Withdrawals", href: "/withdrawals/pending", icon: Clock },
      { label: "Approved Withdrawals", href: "/withdrawals/approved", icon: CheckCircle },
      { label: "Rejected Withdrawals", href: "/withdrawals/rejected", icon: XCircle },
      { label: "Agent Withdrawals", href: "/withdrawals/agent", icon: Briefcase },
    ],
  },
  {
    label: "ROI",
    icon: Percent,
    children: [
      { label: "ROI Log", href: "/roi", icon: List },
      { label: "ROI Settings", href: "/roi/settings", icon: Settings },
    ],
  },
  {
    label: "Commissions",
    icon: Coins,
    children: [
      { label: "Commission Log", href: "/commissions", icon: List },
      { label: "Commission Settings", href: "/commissions/settings", icon: Settings },
    ],
  },
  {
    label: "KYC Management",
    icon: ShieldCheck,
    children: [
      { label: "All KYC", href: "/kyc", icon: List },
      { label: "Pending KYC", href: "/kyc/pending", icon: Clock },
      { label: "Approved KYC", href: "/kyc/approved", icon: CheckCircle },
      { label: "Rejected KYC", href: "/kyc/rejected", icon: XCircle },
    ],
  },
  {
    label: "Agent Management",
    icon: Briefcase,
    children: [
      { label: "All Agents", href: "/agents", icon: Briefcase },
      { label: "Add Agent", href: "/agents/add", icon: UserPlus },
      { label: "Password Reset", href: "/agents/password-reset", icon: KeyRound },
    ],
  },
  {
    label: "Investor Management",
    icon: Users,
    children: [
      { label: "All Investors", href: "/investors", icon: Users },
      { label: "Password Reset", href: "/investors/password-reset", icon: KeyRound },
    ],
  },
  {
    label: "Reports",
    icon: PieChart,
    children: [
      { label: "Investment Report", href: "/reports/investments", icon: TrendingUp },
      { label: "ROI Report", href: "/reports/roi", icon: Percent },
      { label: "Commissions Report", href: "/reports/commissions", icon: Coins },
      { label: "Withdrawals Report", href: "/reports/withdrawals", icon: Landmark },
    ],
  },
  {
    label: "Subscribers",
    icon: Mail,
    href: "/subscribers",
  },
  {
    label: "System Settings",
    icon: Settings,
    children: [
      { label: "Investment Settings", href: "/settings/investment", icon: TrendingUp },
      { label: "Admin Settings", href: "/settings/admin", icon: ShieldCheck },
      { label: "Client Settings", href: "/settings/client", icon: Users },
    ],
  },
];