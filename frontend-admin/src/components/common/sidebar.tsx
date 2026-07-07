import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../../lib/constant";


type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
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
          "bg-[#0d1b4b] text-white transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2 select-none">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-sm">
              H
            </div>
            <span className="text-xl font-bold">
              Fin<span className="text-orange-400">zip</span>
            </span>
          </a>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white"
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Icon size={18} className="shrink-0 text-white/70" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="bg-orange-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-sm">
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown
                      size={14}
                      className={`shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="mt-0.5 ml-9 space-y-0.5">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          className={({ isActive }) =>
                            [
                              "block px-3 py-2 rounded-md text-sm transition-colors",
                              isActive
                                ? "bg-white/15 text-white"
                                : "text-white/65 hover:text-white hover:bg-white/10",
                            ].join(" ")
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.href!}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10",
                  ].join(" ")
                }
              >
                <Icon size={18} className="shrink-0 text-white/70" />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/10 text-center">
          <span className="text-xs tracking-widest text-orange-400 font-semibold uppercase">
            Finzip
          </span>
          <span className="text-xs text-white/50 ml-1">V2.0</span>
        </div>
      </aside>
    </>
  );
}