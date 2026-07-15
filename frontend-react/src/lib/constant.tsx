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
  ShieldCheck,
  Briefcase,
  Percent,
  Coins,
  PieChart,
  Mail,
  Settings,
  Network,
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
    href: "/admin/dashboard",
  },
  {
    label: "Investments",
    icon: TrendingUp,
    children: [
      { label: "All Investments", href: "/admin/investments", icon: List },
      {
        label: "Active Investments",
        href: "/admin/investments/active",
        icon: CheckCircle,
      },
      {
        label: "Completed Investments",
        href: "/admin/investments/completed",
        icon: CheckSquare,
      },
      {
        label: "Closed Investments",
        href: "/admin/investments/closed",
        icon: XCircle,
      },
      {
        label: "Close Requests",
        href: "/admin/investments/close-requests",
        icon: Clock,
      },
    ],
  },
  {
    label: "Withdrawals",
    icon: Landmark,
    children: [
      { label: "All Withdrawals", href: "/admin/withdrawals", icon: List },
      {
        label: "Pending Withdrawals",
        href: "/admin/withdrawals/pending",
        icon: Clock,
      },
      {
        label: "Approved Withdrawals",
        href: "/admin/withdrawals/approved",
        icon: CheckCircle,
      },
      {
        label: "Rejected Withdrawals",
        href: "/admin/withdrawals/rejected",
        icon: XCircle,
      },
      {
        label: "Agent Withdrawals",
        href: "/admin/withdrawals/agent",
        icon: Briefcase,
      },
    ],
  },
  {
    label: "ROI Log",
    href: "/admin/roi",
    icon: Percent,
  },
  {
    label: "Commission Log",
    href: "/admin/commissions",
    icon: Coins,
  },
  {
    label: "KYC Management",
    icon: ShieldCheck,
    children: [
      { label: "All KYC", href: "/admin/kyc", icon: List },
      { label: "Pending KYC", href: "/admin/kyc/pending", icon: Clock },
      { label: "Approved KYC", href: "/admin/kyc/approved", icon: CheckCircle },
      { label: "Rejected KYC", href: "/admin/kyc/rejected", icon: XCircle },
    ],
  },
  {
    label: "Agent Management",
    icon: Briefcase,
    children: [
      { label: "All Agents", href: "/admin/agents", icon: Briefcase },
      { label: "Add Agent", href: "/admin/agents/add", icon: UserPlus },
      { label: "Genealogy Tree", href: "/admin/agents/tree", icon: Network },
      {
        label: "Password Reset",
        href: "/admin/agents/password-reset",
        icon: KeyRound,
      },
    ],
  },
  {
    label: "Investor Management",
    icon: Users,
    children: [
      { label: "All Investors", href: "/admin/investors", icon: Users },
      {
        label: "Password Reset",
        href: "/admin/investors/password-reset",
        icon: KeyRound,
      },
    ],
  },
  {
    label: "Reports",
    icon: PieChart,
    children: [
      {
        label: "Investment Report",
        href: "/admin/reports/investments",
        icon: TrendingUp,
      },
      { label: "ROI Report", href: "/admin/reports/roi", icon: Percent },
      {
        label: "Commissions Report",
        href: "/admin/reports/commissions",
        icon: Coins,
      },
      {
        label: "Withdrawals Report",
        href: "/admin/reports/withdrawals",
        icon: Landmark,
      },
    ],
  },
  {
    label: "Subscribers",
    icon: Mail,
    href: "/admin/subscribers",
  },
  {
    label: "System Settings",
    icon: Settings,
    children: [
      {
        label: "Investment Settings",
        href: "/admin/settings/investment",
        icon: TrendingUp,
      },
      {
        label: "Admin Settings",
        href: "/admin/settings/admin",
        icon: ShieldCheck,
      },
      { label: "Client Settings", href: "/admin/settings/client", icon: Users },
    ],
  },
];
