import Topbar from "../common/topbar";
import Sidebar from "../common/sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { appearanceSettings } from "../../lib/data";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = `${appearanceSettings.appName} - Admin Panel`;
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = appearanceSettings.faviconUrl;
  }, []);

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
