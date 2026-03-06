import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BarChart3,
  Users,
  ShieldAlert,
  Network,
  Scale,
  DatabaseBackup,
  Menu,
  X,
  Moon,
  Sun,
  Activity
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/flow', name: 'Financial Flow', icon: BarChart3 },
    { path: '/actors', name: 'Actor Matrix', icon: Users },
    { path: '/vault', name: 'Secure Vault', icon: ShieldAlert },
    { path: '/claims', name: 'Verified Claims', icon: Network },
    { path: '/regulatory', name: 'Regulatory Context', icon: Scale },
    // Admin Hub is handled as a secure, unlisted route.
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - Tactical Dark/Light Mode Styling */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r transform transition-colors duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          dark:bg-slate-950 dark:border-slate-800 bg-white border-slate-200
        `}
      >
        <div className="h-16 flex items-center px-6 border-b dark:border-slate-800 border-slate-200 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-emerald-500/10 dark:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)] dark:shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-500/20">
              <Activity size={18} className="text-emerald-500" />
            </div>
            <span className="font-bold text-xl tracking-tight dark:text-slate-100 text-slate-900">KweliNet</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden dark:text-slate-400 text-slate-500 hover:text-slate-300">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          <div className="text-[10px] font-bold dark:text-slate-500 text-slate-400 uppercase tracking-widest mb-3 px-3">
            Core Modules
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium border-l-2
                  ${isActive
                    ? 'dark:bg-slate-900/50 dark:text-emerald-400 dark:border-emerald-500 dark:shadow-[inset_2px_0_10px_rgba(16,185,129,0.05)] bg-emerald-50 text-emerald-700 border-emerald-500'
                    : 'dark:text-slate-400 dark:hover:bg-slate-900/30 dark:hover:text-slate-200 dark:border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                  }`
                }
              >
                <item.icon size={18} className="shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User / Settings Footer */}
        <div className="p-4 border-t dark:border-slate-800 border-slate-200 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[11px] font-mono tracking-wider dark:text-emerald-500 text-emerald-600 uppercase">System Online</span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:border-slate-800 border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={14} /> Light Mode
              </>
            ) : (
              <>
                <Moon size={14} /> Tactical Mode
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full flex overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-transform duration-300">
        {/* Mobile Header (Tactical) */}
        <header className="lg:hidden h-16 border-b dark:border-slate-800 border-slate-200 flex items-center px-4 sticky top-0 z-30 dark:bg-slate-950/80 bg-white/80 backdrop-blur-md">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-current opacity-70 hover:opacity-100 rounded-md"
          >
            <Menu size={24} />
          </button>
          <span className="ml-2 font-bold text-lg tracking-tight flex items-center gap-2">
            <Activity size={16} className="text-emerald-500" />
            KweliNet
          </span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full relative">
          <div className="h-full w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
