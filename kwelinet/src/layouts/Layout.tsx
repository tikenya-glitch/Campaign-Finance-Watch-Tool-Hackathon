import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  ShieldAlert,
  Network,
  Scale,
  DatabaseBackup,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  const navItems = [
    { path: '/', name: 'Financial Flow', icon: BarChart3 },
    { path: '/actors', name: 'Actor Matrix', icon: Users },
    { path: '/vault', name: 'Secure Vault', icon: ShieldAlert },
    { path: '/claims', name: 'Verified Claims', icon: Network },
    { path: '/regulatory', name: 'Regulatory Context', icon: Scale },
    { path: '/admin', name: 'Admin Hub', icon: DatabaseBackup },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out flex flex-col 
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">KweliNet</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Modules</div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon size={18} className="shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldAlert size={14} className="text-emerald-500" />
            <span>Connection Secure • v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isVault = location.pathname === '/vault';
  const isAdmin = location.pathname === '/admin';

  return (
    <div className={`min-h-screen flex font-sans selection:bg-emerald-100 selection:text-emerald-900 ${isVault ? 'bg-slate-950' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Mobile Header */}
        {!isAdmin && (
          <header className={`lg:hidden h-16 border-b flex items-center px-4 sticky top-0 z-30 ${isVault ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-current opacity-70 hover:opacity-100 rounded-md"
            >
              <Menu size={24} />
            </button>
            <span className="ml-2 font-bold text-lg tracking-tight">KweliNet</span>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
