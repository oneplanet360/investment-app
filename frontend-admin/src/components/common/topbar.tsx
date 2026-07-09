import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, Globe, Bell, Wrench, ChevronDown, User, KeyRound, LogOut } from "lucide-react";
import CommandPalette from "./command-paletter";
import { useAdminSignOut } from "../../services/adminAuth/adminAuth.query";


type TopbarProps = {
  onMenuClick: () => void;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: signOut } = useAdminSignOut();

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="h-14 bg-(--theme-sidebar) flex items-center px-4 gap-3 sticky top-0 z-10">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white/70 hover:text-white p-1"
        >
          <Menu size={22} />
        </button>

        {/* Search trigger — looks like an input, opens the palette */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 flex-1 max-w-sm bg-white/8 border border-white/10 rounded-md px-3 py-1.5 text-left hover:border-white/20 hover:bg-white/10 transition-colors"
        >
          <Search size={15} className="text-white/40 shrink-0" />
          <span className="flex-1 text-sm text-white/35 select-none">Search here...</span>
          <span className="hidden sm:flex items-center gap-1">
            <kbd className="flex items-center gap-0.5 text-[10px] text-white/30 border border-white/15 rounded px-1 py-0.5 font-mono">
              ctrl
            </kbd>
            <span className="text-white/20 text-[10px]">+</span>
            <kbd className="flex items-center text-[10px] text-white/30 border border-white/15 rounded px-1 py-0.5 font-mono">
              K
            </kbd>
          </span>
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <button className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
            <Globe size={18} />
          </button>

          <button className="relative w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              9+
            </span>
          </button>

          <button className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
            <Wrench size={18} />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="hidden sm:block text-sm text-white font-medium">admin</span>
              <ChevronDown
                size={14}
                className={`text-white/50 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl py-1 z-50">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={15} className="text-gray-500" />
                  Profile
                </Link>
                <Link
                  to="/password"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <KeyRound size={15} className="text-gray-500" />
                  Password
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <LogOut size={15} className="text-gray-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}