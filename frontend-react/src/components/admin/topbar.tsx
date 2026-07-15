import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Globe,
  Bell,
  Wrench,
  ChevronDown,
  User,
  KeyRound,
  LogOut,
} from "lucide-react";
import CommandPalette from "./command-paletter";
import { useAdminSignOut } from "../../services/admin/adminAuth/adminAuth.query";
import {
  useAdminNotificationsQuery,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../../services/admin/adminNotifications/adminNotifications.query";
import { PROTECTED_ROUTES } from "../../routes/common/routes";

type TopbarProps = {
  onMenuClick: () => void;
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { mutate: signOut } = useAdminSignOut();
  const { data: notifData } = useAdminNotificationsQuery({ limit: 4 });
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const notifications = notifData?.data?.notifications || [];
  const unreadCount = notifData?.data?.unreadCount || 0;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      markRead(id);
    }
    setNotificationsOpen(false);
    navigate(PROTECTED_ROUTES.ADMINNOTIFICATIONS);
  };

  return (
    <>
      <header className="h-14 bg-[var(--theme-sidebar)] flex items-center px-4 gap-3 sticky top-0 z-10">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[var(--theme-sidebar-fg-muted)] hover:text-[var(--theme-sidebar-fg)] p-1"
        >
          <Menu size={22} />
        </button>

        {/* Search trigger — looks like an input, opens the palette */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 flex-1 max-w-sm border border-[var(--theme-sidebar-fg)] opacity-60 hover:opacity-100 rounded-md px-3 py-1.5 text-left transition-opacity"
        >
          <Search
            size={15}
            className="text-[var(--theme-sidebar-fg)] shrink-0"
          />
          <span className="flex-1 text-sm text-[var(--theme-sidebar-fg)] select-none">
            Search here...
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <kbd className="flex items-center gap-0.5 text-[10px] text-[var(--theme-sidebar-fg)] border border-[var(--theme-sidebar-fg)] rounded px-1 py-0.5 font-mono">
              ctrl
            </kbd>
            <span className="text-[var(--theme-sidebar-fg)] text-[10px]">
              +
            </span>
            <kbd className="flex items-center text-[10px] text-[var(--theme-sidebar-fg)] border border-[var(--theme-sidebar-fg)] rounded px-1 py-0.5 font-mono">
              K
            </kbd>
          </span>
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <button className="w-9 h-9 flex items-center justify-center text-[var(--theme-sidebar-fg-muted)] hover:text-[var(--theme-sidebar-fg)] rounded-md transition-colors">
            <Globe size={18} />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative w-9 h-9 flex items-center justify-center text-[var(--theme-sidebar-fg-muted)] hover:text-[var(--theme-sidebar-fg)] rounded-md transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllRead()}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-sm">
                      No notifications yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {notifications.map((notif: any) => (
                        <div
                          key={notif._id}
                          onClick={() =>
                            handleNotificationClick(notif._id, notif.isRead)
                          }
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.isRead ? "bg-indigo-50/30" : ""}`}
                        >
                          <div className="flex gap-3">
                            <div className="mt-0.5">
                              {notif.isRead ? (
                                <Bell size={16} className="text-gray-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${!notif.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}
                              >
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {timeAgo(notif.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 p-2">
                  <Link
                    to={PROTECTED_ROUTES.ADMINNOTIFICATIONS}
                    onClick={() => setNotificationsOpen(false)}
                    className="block w-full text-center py-2 text-sm text-indigo-600 font-medium rounded-md hover:bg-indigo-50 transition-colors"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button className="w-9 h-9 flex items-center justify-center text-[var(--theme-sidebar-fg-muted)] hover:text-[var(--theme-sidebar-fg)] rounded-md transition-colors">
            <Wrench size={18} />
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md opacity-80 hover:opacity-100 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-indigo-500)] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="hidden sm:block text-sm text-[var(--theme-sidebar-fg)] font-medium">
                admin
              </span>
              <ChevronDown
                size={14}
                className={`text-[var(--theme-sidebar-fg-muted)] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl py-1 z-50">
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={15} className="text-gray-500" />
                  Profile
                </Link>
                <Link
                  to="/admin/password"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <KeyRound size={15} className="text-gray-500" />
                  Password
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <LogOut size={15} className="text-gray-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  );
}
