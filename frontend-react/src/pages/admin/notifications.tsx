import { useState } from "react";
import { Bell, CheckCircle2, Inbox } from "lucide-react";
import { useAdminNotificationsQuery, useMarkNotificationRead, useMarkAllNotificationsRead } from "../../services/admin/adminNotifications/adminNotifications.query";

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

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  
  const { data, isLoading } = useAdminNotificationsQuery({ 
    limit: 50, 
    unreadOnly: filter === "unread" 
  });
  
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  return (
    <div className="min-h-full bg-[var(--theme-bg)] p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with the latest system activities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === "all" ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === "unread" ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Unread
            </button>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <CheckCircle2 size={16} className="text-gray-400" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Inbox size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications found</h3>
            <p className="text-gray-500">
              {filter === "unread" 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif: any) => (
              <div 
                key={notif._id}
                className={`p-4 sm:p-5 flex gap-4 transition-colors ${
                  notif.isRead ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50/30 hover:bg-indigo-50/60'
                }`}
              >
                <div className="shrink-0 mt-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notif.isRead ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    <Bell size={18} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-1">
                    <h4 className={`text-base ${notif.isRead ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${notif.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                    {notif.message}
                  </p>
                  
                  {!notif.isRead && (
                    <button
                      onClick={() => markRead(notif._id)}
                      className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
