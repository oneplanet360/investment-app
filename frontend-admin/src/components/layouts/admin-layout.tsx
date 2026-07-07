import Topbar from "../common/topbar";
import Sidebar from "../common/sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
 <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
       {/* Topbar and Main */}
       <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
       </div>
    </div>
  )
}
