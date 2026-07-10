import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Gauge,
  Coins,
  CreditCard,
  ArrowDownToLine,
  Users,
  User,
  Key,
  ShieldCheck,
  LogOut,
  ChevronRight,
  X,
  ArrowUpCircle,
  TrendingUp,
} from "lucide-react";

interface SidebarProps {
  role: "investor" | "agent";
  isOpen?: boolean;
  onClose?: () => void;
}

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: SubMenuItem[];
}

export default function Sidebar({
  role,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const location = useLocation();

  // Track which submenus are expanded
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Agent Menu
  const agentMenuItems: MenuItem[] = [
    { label: "Dashboard", icon: Gauge, path: "dashboard" },
    {
      label: "Investors",
      icon: Users,
      children: [
        { label: "All Investors", path: "all-investors" },
        { label: "Add Investor", path: "add-investor" },
      ],
    },
    { label: "Team", icon: Users, path: "team" },
    { label: "Commissions", icon: Coins, path: "commissions" },
    { label: "Wallet", icon: CreditCard, path: "wallet" },
    { label: "Withdrawals", icon: ArrowDownToLine, path: "withdrawals" },
    { label: "Profile Setting", icon: User, path: "profile-setting" },
    { label: "Change Password", icon: Key, path: "change-password" },
    { label: "2FA Security", icon: ShieldCheck, path: "2fa-security" },
    { label: "Log Out", icon: LogOut, path: "logout" },
  ];

  // Investor Menu
  const investorMenuItems: MenuItem[] = [
    { label: "Dashboard", icon: Gauge, path: "dashboard" },
    { label: "Investments", icon: Coins, path: "investments" },
    { label: "Top-ups", icon: ArrowUpCircle, path: "top-ups" },
    { label: "ROI History", icon: TrendingUp, path: "roi-history" },
    { label: "Wallet", icon: CreditCard, path: "wallet" },
    { label: "Withdrawals", icon: ArrowDownToLine, path: "withdrawals" },
    { label: "KYC", icon: ShieldCheck, path: "kyc" },
    { label: "Profile Setting", icon: User, path: "profile-setting" },
    { label: "Change Password", icon: Key, path: "change-password" },
    { label: "2FA Security", icon: ShieldCheck, path: "2fa-security" },
    { label: "Log Out", icon: LogOut, path: "logout" },
  ];

  const menuItems = role === "agent" ? agentMenuItems : investorMenuItems;

  // Automatically expand the submenu that contains the active child route on navigation
  useEffect(() => {
    const activeMenu = menuItems.find((item) =>
      item.children?.some(
        (child) => location.pathname === `/${role}/${child.path}`
      )
    );
    if (activeMenu) {
      const menuLabel = activeMenu.label.toLowerCase();
      setExpandedMenus((prev) =>
        prev.includes(menuLabel) ? prev : [...prev, menuLabel]
      );
    }
  }, [location.pathname, role]);

  const toggleSubMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label.toLowerCase())
        ? prev.filter((item) => item !== label.toLowerCase())
        : [...prev, label.toLowerCase()]
    );
  };

  const footerUser =
    role === "agent"
      ? { name: "Sarah Smith", initials: "SS", label: "Agent", tag: "AGENT" }
      : { name: "John Doe", initials: "JD", label: "Investor", tag: "PRO" };

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col bg-[#141414] border-r border-[#222] transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-orange-500/20">
              F
            </div>
            <span className="text-xl font-extrabold tracking-wide text-white font-sans">
              Fin<span className="text-orange-500">zip</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          {menuItems.map((item) => {
            const isSubMenuOpen = expandedMenus.includes(item.label.toLowerCase());
            const hasChildren = !!item.children;

            // Compute standard absolute paths for router Link elements
            const targetPath = item.path === "logout" ? "/" : `/${role}/${item.path}`;
            const isMainActive = !hasChildren && location.pathname === targetPath;
            const isChildActive =
              hasChildren &&
              item.children?.some(
                (child) => location.pathname === `/${role}/${child.path}`
              );
            const isActive = isMainActive || isChildActive;

            // Header classes
            const headerClasses = `
              w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 select-none cursor-pointer
              ${
                isActive
                  ? "bg-[#2b1b12] text-orange-500"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
              }
            `.trim();

            if (hasChildren) {
              return (
                <div key={item.label} className="space-y-1">
                  <div
                    onClick={() => toggleSubMenu(item.label)}
                    className={headerClasses}
                  >
                    <item.icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-orange-500" : "text-zinc-400"
                      }`}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight
                      size={16}
                      className={`shrink-0 transition-transform duration-200 ${
                        isSubMenuOpen ? "rotate-90 text-orange-500" : "text-zinc-500"
                      }`}
                    />
                  </div>

                  {/* Submenu List */}
                  {isSubMenuOpen && (
                    <div className="mt-1 ml-4 pl-4 border-l border-[#2c2c2c] space-y-1 transition-all">
                      {item.children?.map((child) => {
                        const childPath = `/${role}/${child.path}`;
                        const isSubActive = location.pathname === childPath;

                        return (
                          <Link
                            key={child.label}
                            to={childPath}
                            onClick={onClose}
                            className={`
                              flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200
                              ${
                                isSubActive
                                  ? "text-orange-500"
                                  : "text-zinc-400 hover:text-white hover:bg-white/2"
                              }
                            `.trim()}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full border shrink-0 transition-colors ${
                                isSubActive
                                  ? "border-orange-500 bg-orange-500/20"
                                  : "border-zinc-500"
                              }`}
                            />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Normal Link item
            return (
              <Link
                key={item.label}
                to={targetPath}
                onClick={onClose}
                className={headerClasses}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-orange-500" : "text-zinc-400"
                  }`}
                />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-[#222] bg-[#111] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
              {footerUser.initials}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white leading-none">
                {footerUser.name}
              </span>
              <span className="text-[10px] text-zinc-500 mt-0.5">
                {footerUser.label}
              </span>
            </div>
          </div>
          <span className="text-[10px] tracking-wider text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full">
            {footerUser.tag}
          </span>
        </div>
      </aside>
    </>
  );
}
