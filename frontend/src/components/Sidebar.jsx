import { useState } from "react";

export default function Sidebar({ onProfileOpen, logo = "YourBrand" }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-2 top-4 h-[95%] border-3 rounded-2xl ${
        collapsed ? "w-16" : "w-64"
      } bg-zinc-900/80 backdrop-blur-md border-zinc-700 text-white flex flex-col transition-[width] duration-200 ease-out z-20`}
    >
      {/* Top section: collapse toggle + logo */}
      <div className="px-3 py-3 border-b border-zinc-800">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } gap-2`}
        >
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-md hover:bg-zinc-800 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <img
              className={`w-6 h-6 bg-red-500 p-0.5 hover:scale-90 rounded-2xl ${
                collapsed ? "rotate-90" : "-rotate-90"
              }`}
              src="/images/Sidebar-collapseArrow.png"
              alt="toggle"
            />
          </button>

          {/* Logo */}
          {!collapsed && (
            <div className="ml-2 text-sm font-semibold tracking-wide select-none">
              {logo}
            </div>
          )}
        </div>
      </div>

      {/* Middle section: placeholder */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {!collapsed ? (
          <div className="text-zinc-400 text-sm">Welcome to your chat.</div>
        ) : (
          <div className="text-zinc-600 text-xs text-center">Chat</div>
        )}
      </div>

      {/* Bottom section: profile */}
      <div className="mt-auto px-3 py-3 border-t border-zinc-800">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } gap-2`}
        >
          <button
            onClick={onProfileOpen}
            className="p-1.5 rounded-3xl bg-zinc-800 hover:bg-red-500 transition-colors flex items-center"
            aria-label="Open profile"
            title="Profile"
          >
            <img
              className="w-6 h-6"
              src="/images/Sidebar-userIcon.png"
              alt="profile"
            />
          </button>
        </div>
      </div>
    </aside>
  );
}