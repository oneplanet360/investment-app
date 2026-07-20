import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/client/sidebar";
import Topbar from "../components/client/topbar";

import { useClientVerifyUser } from "../services/client/clientAuth/clientAuth.query";

export default function AgentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: userData } = useClientVerifyUser();
  const user = userData?.data;
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "--";

  return (
    <div className="flex h-screen bg-client-bg text-client-text font-sans overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        role="agent"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Topbar */}
        <Topbar
          role="agent"
          onToggleSidebar={() => setSidebarOpen(true)}
          searchPlaceholder="Search referrals..."
          user={{
            name: user?.name || "Loading...",
            initials: initials,
            details: user?.username ? `@${user.username}` : "Agent",
          }}
        />

        {/* Dashboard Workspace Children */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
