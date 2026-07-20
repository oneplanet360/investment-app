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
        <p className="text-client-text-secondary">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="text-brand-primary" size={24} />
        <h1 className="text-2xl font-bold text-client-text tracking-tight">
          Notifications
        </h1>
      </div>

      <div className="bg-client-card rounded-2xl border border-client-border overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-client-text-secondary">
            No notifications available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-client-border bg-client-card">
                  <th className="py-4 px-6 font-medium text-sm text-client-text-secondary w-16 text-center">
                    Status
                  </th>
                  <th className="py-4 px-6 font-medium text-sm text-client-text-secondary w-1/4">
                    Title
                  </th>
                  <th className="py-4 px-6 font-medium text-sm text-client-text-secondary">
                    Message
                  </th>
                  <th className="py-4 px-6 font-medium text-sm text-client-text-secondary w-48">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
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
                    <tr
                      key={notif._id}
                      onClick={() => {
                        if (!notif.isRead) markAsRead(notif._id);
                      }}
                      className={`border-b border-client-border cursor-pointer transition-colors ${
                        !notif.isRead
                          ? "bg-brand-primary/5 hover:bg-brand-primary/10"
                          : "hover:bg-client-card/50"
                      }`}
                    >
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full shadow-sm ${
                            !notif.isRead
                              ? "bg-brand-primary shadow-brand-primary/50"
                              : "bg-client-border"
                          }`}
                        />
                      </td>
                      <td
                        className={`py-4 px-6 text-sm font-bold whitespace-nowrap ${
                          !notif.isRead ? "text-client-text" : "text-client-text-secondary"
                        }`}
                      >
                        {notif.title}
                      </td>
                      <td
                        className={`py-4 px-6 text-sm ${
                          !notif.isRead ? "text-client-text" : "text-client-text-secondary"
                        }`}
                      >
                        {notif.message}
                      </td>
                      <td className="py-4 px-6 text-sm text-client-text-secondary whitespace-nowrap">
                        {new Date(notif.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
