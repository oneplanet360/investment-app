import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/client/topbar";
import Sidebar from "../components/client/sidebar";

import { useClientVerifyUser } from "../services/client/clientAuth/clientAuth.query";

export default function InvestorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: userData } = useClientVerifyUser();
  const user = userData?.data;
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "--";

  return (
    <div className="flex h-screen bg-client-bg text-client-text font-sans overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        role="investor"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Topbar */}
        <Topbar
          role="investor"
          onToggleSidebar={() => setSidebarOpen(true)}
          searchPlaceholder="Search investments..."
          user={{
            name: user?.name || "Loading...",
            initials: initials,
            details: user?.username ? `@${user.username}` : "Investor",
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
