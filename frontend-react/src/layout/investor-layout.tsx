import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/client/topbar";
import Sidebar from "../components/client/sidebar";

export default function InvestorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0b0b0b] text-white font-sans overflow-hidden">
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
            name: "John Doe",
            initials: "JD",
            details: "Account ID: #28475",
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
