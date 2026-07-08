import { Menu, Bell, Search } from "lucide-react";

interface TopbarUser {
  name: string;
  initials: string;
  details: string;
}

interface TopbarProps {
  onToggleSidebar: () => void;
  searchPlaceholder?: string;
  user: TopbarUser;
}

export default function Topbar({
  onToggleSidebar,
  searchPlaceholder = "Search...",
  user,
}: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#141414]/40 border-b border-[#222] backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button (Mobile) */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar (Desktop/Tablet) */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="bg-[#18181b] border border-[#2c2c2c] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-[#18181b] transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
        </button>

        {/* Profile Avatar Widget */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800 select-none">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs">
            {user.initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-none">{user.name}</p>
            <span className="text-[10px] text-zinc-500 mt-1 block">{user.details}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
