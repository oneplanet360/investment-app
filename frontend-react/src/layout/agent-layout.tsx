import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/client/sidebar";
import Topbar from "../components/client/topbar";


export default function AgentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0b0b0b] text-white font-sans overflow-hidden">
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
          onToggleSidebar={() => setSidebarOpen(true)}
          searchPlaceholder="Search referrals..."
          user={{
            name: "Sarah Smith",
            initials: "SS",
            details: "Agent ID: #10485",
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
