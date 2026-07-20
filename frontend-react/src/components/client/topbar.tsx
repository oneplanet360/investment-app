import { Menu, Bell, Search, User, LogOut, ChevronDown, Key } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClientSignOut } from "../../services/client/clientAuth/clientAuth.query";
import {
  useClientNotificationsQuery,
  useMarkNotificationRead,
} from "../../services/client/clientNotifications/clientNotifications.query";
import { toast } from "sonner";

interface TopbarUser {
  name: string;
  initials: string;
  details: string;
}

interface TopbarProps {
  onToggleSidebar: () => void;
  searchPlaceholder?: string;
  user: TopbarUser;
  role: "investor" | "agent";
}

export default function Topbar({
  onToggleSidebar,
  searchPlaceholder = "Search here...",
  user,
  role,
}: TopbarProps) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { mutate: signOut } = useClientSignOut();
  const { data: notificationsData } = useClientNotificationsQuery();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const unreadCount = notificationsData?.unreadCount || 0;
  const notifications = notificationsData?.notifications || [];



  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchItems = [
    { label: "Dashboard", path: "dashboard" },
    { label: "Investments", path: "investments", role: "investor" },
    { label: "ROI History", path: "roi-history", role: "investor" },
    { label: "Investors", path: "all-investors", role: "agent" },
    { label: "Assign User", path: "assign-user", role: "agent" },
    { label: "Genealogy Tree", path: "tree", role: "agent" },
    { label: "Commissions", path: "commissions", role: "agent" },
    { label: "Wallet", path: "wallet" },
    { label: "Withdrawals", path: "withdrawals" },
    { label: "Notifications", path: "notifications" },
    { label: "KYC Verification", path: "kyc" },
    { label: "Nominee Verification", path: "nominee" },
    { label: "Profile Setting", path: "profile-setting" },
    { label: "Change Password", path: "change-password" },
    { label: "2FA Security", path: "2fa-security" },
  ];

  const filteredItems = searchItems
    .filter((item) => !item.role || item.role === role)
    .filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-client-bg-secondary/40 border-b border-client-border backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button (Mobile) */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-client-text-secondary hover:text-client-text p-1.5 rounded-lg hover:bg-client-bg transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar (Desktop/Tablet) */}
        <div className="relative hidden sm:block" ref={searchRef}>
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-client-text-secondary"
            size={16}
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="bg-client-bg-secondary border border-client-border rounded-xl pl-10 pr-4 py-2 text-xs text-client-text placeholder-zinc-500 focus:outline-none focus:border-brand-primary/50 w-64 transition-all"
          />
          
          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-client-bg-secondary border border-client-border rounded-xl shadow-lg shadow-black/50 overflow-hidden z-50">
              <div className="max-h-64 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="p-3 text-xs text-client-text-secondary text-center">
                    No matching pages found
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        navigate(`/${role}/${item.path}`);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-client-text hover:bg-black/5 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative select-none" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative text-client-text-secondary hover:text-client-text p-2 rounded-xl hover:bg-client-bg-secondary transition-colors cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 rounded-full bg-brand-primary flex items-center justify-center text-[9px] text-client-text font-bold px-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-client-bg-secondary border border-client-border rounded-xl shadow-lg shadow-black/50 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-client-border flex justify-between items-center">
                <h3 className="text-sm font-semibold text-client-text">
                  Notifications
                </h3>
                <span className="text-xs text-brand-primary">
                  {unreadCount} new
                </span>
              </div>

              <div className="max-h-75 overflow-y-auto divide-y divide-client-border">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-client-text-secondary">
                    No notifications
                  </div>
                ) : (
                  notifications
                    .slice(0, 4)
                    .map(
                      (
                        notif: Record<string, unknown> & {
                          _id: string;
                          isRead: boolean;
                          title: string;
                          message: string;
                          createdAt: string;
                        },
                      ) => (
                        <div
                          key={notif._id}
                          onClick={() => {
                            if (!notif.isRead)
                              markAsRead(notif._id, {
                                onError: (error: unknown) => {
                                  toast.error(
                                    (
                                      error as {
                                        response?: {
                                          data?: { message?: string };
                                        };
                                      }
                                    )?.response?.data?.message ||
                                      "Failed to mark notifications as read",
                                  );
                                },
                              });
                          }}
                          className={`p-3 cursor-pointer transition-colors hover:bg-black/5 ${!notif.isRead ? "bg-[#1a1a1e]" : ""}`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h4
                              className={`text-xs font-semibold ${!notif.isRead ? "text-client-text" : "text-client-text-secondary"}`}
                            >
                              {notif.title}
                            </h4>
                            {!notif.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-client-text-secondary mt-1 line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      ),
                    )
                )}
              </div>

              <Link
                to={`/${role}/notifications`}
                onClick={() => setIsNotifOpen(false)}
                className="block text-center text-xs text-brand-primary hover:text-brand-primary py-2 border-t border-client-border bg-white/2 hover:bg-white/4 transition-colors"
              >
                View all
              </Link>
            </div>
          )}
        </div>

        {/* Profile Avatar Widget */}
        <div
          className="relative pl-2 border-l border-client-border select-none"
          ref={dropdownRef}
        >
          <div
            className="flex items-center gap-2.5 cursor-pointer hover:bg-black/5 p-1.5 rounded-xl transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-xl bg-client-bg-secondary text-brand-primary flex items-center justify-center font-bold text-xs">
              {user.initials}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-left">
                <p className="text-xs font-semibold text-client-text leading-none">
                  {user.name}
                </p>
                <span className="text-[10px] text-client-text-secondary mt-1 block">
                  {user.details}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`text-client-text-secondary transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-client-bg-secondary border border-client-border rounded-xl shadow-lg shadow-black/50 py-1.5 z-50 overflow-hidden">
              <Link
                to={`/${role}/profile-setting`}
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-sm text-client-text-secondary hover:text-client-text hover:bg-black/5 transition-colors"
              >
                <User size={16} />
                <span>Profile Setting</span>
              </Link>
              <Link
                to={`/${role}/change-password`}
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-sm text-client-text-secondary hover:text-client-text hover:bg-black/5 transition-colors"
              >
                <Key size={16} />
                <span>Change Password</span>
              </Link>
              <div className="h-px bg-client-bg-secondary my-1" />
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  signOut();
                }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-sm text-client-error hover:text-client-error hover:bg-client-error/10 transition-colors"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
