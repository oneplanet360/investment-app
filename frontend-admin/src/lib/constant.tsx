import {
  Home,
  Users,
  UserPlus,
  KeyRound,
  ThumbsUp,
  BarChart2,
  Receipt,
  Landmark,
  List,
  Clock,
  CheckCircle,
  CheckSquare,
  XCircle,
  PlayCircle,
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
    label: "Agent Management",
    icon: Users,
    children: [
      { label: "All Agents", href: "/agents", icon: Users },
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
    label: "Subscribers",
    icon: ThumbsUp,
    href: "/subscribers",
  },
  {
    label: "Investment Report",
    icon: BarChart2,
    href: "/investment-report",
  },
  {
    label: "Deposits",
    icon: Receipt,
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
    ],
  },
];