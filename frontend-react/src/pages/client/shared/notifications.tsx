import { Bell } from "lucide-react";
import {
  useClientNotificationsQuery,
  useMarkNotificationRead,
} from "../../../services/client/clientNotifications/clientNotifications.query";

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useClientNotificationsQuery();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const notifications = notificationsData?.notifications || [];

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-zinc-400">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="text-orange-500" size={24} />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Notifications
        </h1>
      </div>

      <div className="bg-[#18181b] rounded-2xl border border-zinc-800 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No notifications available.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {notifications.map(
              (
                notif: Record<string, unknown> & {
                  _id: string;
                  title: string;
                  message: string;
                  createdAt: string;
                  isRead: boolean;
                },
              ) => (
                <div
                  key={notif._id}
                  className={`p-4 sm:p-5 transition-colors cursor-pointer hover:bg-[#202024] ${!notif.isRead ? "bg-[#202024]" : ""}`}
                  onClick={() => {
                    if (!notif.isRead) markAsRead(notif._id);
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3
                        className={`text-sm font-semibold mb-1 ${!notif.isRead ? "text-white" : "text-zinc-300"}`}
                      >
                        {notif.title}
                      </h3>
                      <p
                        className={`text-sm ${!notif.isRead ? "text-zinc-300" : "text-zinc-500"}`}
                      >
                        {notif.message}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-orange-500 mt-1" />
                    )}
                  </div>
                  <div className="mt-3 text-xs text-zinc-600">
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
