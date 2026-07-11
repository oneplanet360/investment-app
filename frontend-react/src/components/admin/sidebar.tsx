import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../../lib/constant";
import { useAdminSettingsQuery } from "../../services/admin/adminSettings/adminSettings.query";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { data: settings } = useAdminSettingsQuery();

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed top-0 left-0 h-full w-65 z-30 flex flex-col",
          "bg-(--theme-sidebar) text-(--theme-sidebar-fg) transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2 select-none h-9">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.appName}
                className="max-h-full object-contain"
              />
            ) : (
              <span className="text-xl font-bold truncate">
                {settings?.appName}
              </span>
            )}
          </a>
          <button
            onClick={onClose}
            className="lg:hidden text-(--theme-sidebar-fg-muted) hover:text-(--theme-sidebar-fg)"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isExpanded = openMenus.includes(item.label);

            if (item.children) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-(--theme-sidebar-fg) hover:opacity-80 transition-opacity"
                  >
                    <Icon
                      size={18}
                      className="shrink-0 text-(--theme-sidebar-fg) opacity-70"
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-sm">
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown
                      size={14}
                      className={`shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="mt-0.5 ml-4 space-y-0.5">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            end
                            className={({ isActive }) =>
                              [
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-opacity",
                                isActive
                                  ? "opacity-100 font-semibold"
                                  : "opacity-70 hover:opacity-100",
                              ].join(" ")
                            }
                          >
                            {ChildIcon && (
                              <ChildIcon
                                size={16}
                                className="shrink-0 opacity-70"
                              />
                            )}
                            <span className="flex-1 text-left">
                              {child.label}
                            </span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.href!}
                end
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-opacity",
                    isActive
                      ? "opacity-100 font-semibold"
                      : "opacity-70 hover:opacity-100",
                  ].join(" ")
                }
              >
                <Icon size={18} className="shrink-0 opacity-70" />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-(--theme-sidebar-fg-muted) text-center opacity-70">
          <span className="text-xs tracking-widest text-indigo-500 font-semibold uppercase">
            {settings?.appName}
          </span>
        </div>
      </aside>
    </>
  );
}
