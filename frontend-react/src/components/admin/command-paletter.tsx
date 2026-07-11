import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { sidebarMenu } from "../../lib/constant";

// ─── Build a flat list of all navigable pages ───────────────────────────────

type PageEntry = {
  label: string;
  group: string;
  href: string;
  Icon: React.ElementType;
};

function buildEntries(): PageEntry[] {
  const entries: PageEntry[] = [];

  for (const item of sidebarMenu) {
    if (item.href) {
      entries.push({
        label: item.label,
        group: "Pages",
        href: item.href,
        Icon: item.icon,
      });
    }
    if (item.children) {
      for (const child of item.children) {
        entries.push({
          label: child.label,
          group: item.label,
          href: child.href,
          Icon: item.icon,
        });
      }
    }
  }

  return entries;
}

const ALL_ENTRIES = buildEntries();

// ─── Fuzzy match helper ──────────────────────────────────────────────────────

function matches(entry: PageEntry, query: string): boolean {
  const q = query.toLowerCase();
  return (
    entry.label.toLowerCase().includes(q) ||
    entry.group.toLowerCase().includes(q)
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? ALL_ENTRIES.filter((e) => matches(e, query))
    : ALL_ENTRIES;

  // Reset state when opening
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Keep active item clamped when list shrinks
  useEffect(() => {
    // eslint-disable-next-line
    setActiveIndex((i) => Math.min(i, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  // Scroll active row into view
  useEffect(() => {
    const row = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    row?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleSelect = useCallback(
    (href: string) => {
      navigate(href);
      onClose();
    },
    [navigate, onClose],
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const entry = filtered[activeIndex];
        if (entry) handleSelect(entry.href);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, activeIndex, handleSelect, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
        <div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
          style={{ maxHeight: "70vh" }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
            <Search size={18} className="text-[#3b5fc0] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder="Search settings, menus, and admin pages"
              className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-gray-600 text-xs font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results */}
          <div ref={listRef} className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              filtered.map((entry, i) => {
                const Icon = entry.Icon;
                const isActive = i === activeIndex;
                return (
                  <button
                    key={`${entry.href}-${i}`}
                    data-index={i}
                    onClick={() => handleSelect(entry.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={[
                      "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left",
                      isActive
                        ? "bg-[#3b5fc0] text-white"
                        : "hover:bg-gray-50 text-gray-800",
                    ].join(" ")}
                  >
                    {/* Icon box */}
                    <span
                      className={[
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                        isActive ? "bg-white/20" : "bg-[#eef1fc]",
                      ].join(" ")}
                    >
                      <Icon
                        size={17}
                        className={isActive ? "text-white" : "text-[#3b5fc0]"}
                      />
                    </span>

                    {/* Text */}
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">
                        {entry.label}
                      </span>
                      <span
                        className={[
                          "block text-xs truncate mt-0.5",
                          isActive ? "text-white/70" : "text-gray-400",
                        ].join(" ")}
                      >
                        {entry.group}
                      </span>
                    </span>

                    {isActive && (
                      <ChevronRight
                        size={16}
                        className="text-white/70 shrink-0"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer hints */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-100 bg-gray-50/80">
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <kbd className="bg-white border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px] shadow-sm">
                ↵
              </kbd>
              to select
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <kbd className="bg-white border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px] shadow-sm">
                ↑
              </kbd>
              <kbd className="bg-white border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px] shadow-sm">
                ↓
              </kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <kbd className="bg-white border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px] shadow-sm">
                ESC
              </kbd>
              to close
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
