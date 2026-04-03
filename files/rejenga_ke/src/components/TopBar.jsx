/**
 * TopBar.jsx
 * Responsive application header.
 * - Desktop: full labels + icon for each nav tab
 * - Mobile (< sm): icon-only nav in a horizontally scrollable strip
 */
import { Activity, BarChart2, Map, Search, Clock, Users, AlertTriangle, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',  icon: BarChart2 },
  { id: 'map',         label: 'Map',        icon: Map       },
  { id: 'investigate', label: 'Investigate',icon: Search    },
  { id: 'timeline',    label: 'Timeline',   icon: Clock     },
  { id: 'public',      label: 'Public',     icon: Users     },
];

export default function TopBar({ activeView, onViewChange, suspiciousCount, onAlertsClick, isDark, onThemeToggle }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center gap-0 px-3 bg-surface-card border-b border-surface-border z-20 shrink-0 h-12">
        {/* Brand */}
        <div className="flex items-center gap-2 pr-3 sm:pr-5 border-r border-surface-border h-full shrink-0">
          <div className="w-7 h-7 rounded-lg bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center shrink-0">
            <Activity size={14} className="text-accent-blue" />
          </div>
          <div className="hidden xs:block">
            <h1 className="text-[13px] font-bold text-white leading-tight">
              PoliScope<span className="text-accent-blue"> AI</span>
            </h1>
            <p className="text-[9px] text-gray-600 leading-tight hidden sm:block">Kenya 2027 Monitor</p>
          </div>
        </div>

        {/* Desktop nav — hidden on very small screens */}
        <nav className="hidden sm:flex items-center h-full flex-1 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id;
            return (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`flex items-center gap-1.5 px-3 md:px-4 h-full border-b-2 text-[11px] md:text-[12px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-accent-blue text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                <Icon size={13} />
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden text-[10px]">{label.slice(0, 4)}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile hamburger — shown on sm and below */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="sm:hidden flex items-center justify-center w-8 h-8 ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover transition-colors"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Spacer */}
        <div className="flex-1 sm:hidden" />

        {/* Alerts badge */}
        <button
          onClick={onAlertsClick}
          className="ml-2 flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-accent-red/10 border border-accent-red/30 hover:bg-accent-red/20 transition-colors shrink-0"
        >
          <AlertTriangle size={12} className="text-accent-red" />
          <span className="text-[11px] font-semibold text-accent-red">
            {suspiciousCount}
            <span className="hidden sm:inline"> Alert{suspiciousCount !== 1 ? 's' : ''}</span>
          </span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="ml-2 flex items-center justify-center w-8 h-8 rounded-lg border border-surface-border hover:bg-surface-hover transition-colors shrink-0 text-gray-400 hover:text-white"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Partner pill — desktop only */}
        <div className="hidden xl:flex items-center ml-2 px-2.5 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 shrink-0">
          <span className="text-[10px] text-accent-blue font-medium">TI-Kenya · ELGIA · CMD</span>
        </div>
      </header>

      {/* Mobile slide-down nav */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-surface-card border-b border-surface-border z-30 shrink-0">
          <div className="flex flex-col divide-y divide-surface-border">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeView === id;
              return (
                <button
                  key={id}
                  onClick={() => { onViewChange(id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-5 py-3 text-left text-sm font-medium transition-colors ${
                    isActive ? 'text-white bg-surface-hover' : 'text-gray-400'
                  }`}
                >
                  <Icon size={16} style={isActive ? { color: '#4f8ef7' } : {}} />
                  {label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-blue" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
