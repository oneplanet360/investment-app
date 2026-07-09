import Topbar from "../common/topbar";
import Sidebar from "../common/sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdminSettingsQuery } from "../../services/adminSettings/adminSettings.query";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: settings } = useAdminSettingsQuery();

  useEffect(() => {
    if (!settings) return;

    document.title = `${settings.appName} - Admin Panel`;
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = settings.faviconUrl;

    const root = document.documentElement;
    root.style.setProperty('--theme-bg', settings.backgroundColor);
    root.style.setProperty('--theme-sidebar', settings.sidebarColor);
    root.style.setProperty('--color-indigo-500', settings.primaryColor);
    root.style.setProperty('--color-indigo-600', settings.primaryColor);
    root.style.setProperty('--color-indigo-700', settings.primaryColor);
    root.style.fontFamily = settings.fontFamily;
    
    // Save to localStorage so it can be loaded synchronously on refresh
    localStorage.setItem("admin-theme", JSON.stringify({
      backgroundColor: settings.backgroundColor,
      sidebarColor: settings.sidebarColor,
      primaryColor: settings.primaryColor,
      fontFamily: settings.fontFamily
    }));
  }, [settings]);

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
