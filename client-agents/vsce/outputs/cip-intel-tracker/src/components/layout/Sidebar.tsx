'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Newspaper,
  FolderKanban,
  GitBranch,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Territory types
export type Territory = 'Southern California' | 'Northern California' | 'PNW';

// Context for territory selection
interface TerritoryContextType {
  territory: Territory;
  setTerritory: (territory: Territory) => void;
}

const TerritoryContext = createContext<TerritoryContextType | undefined>(undefined);

export function useTerritoryContext() {
  const context = useContext(TerritoryContext);
  if (!context) {
    throw new Error('useTerritoryContext must be used within TerritoryProvider');
  }
  return context;
}

// Territory Provider component
export function TerritoryProvider({ children }: { children: ReactNode }) {
  const [territory, setTerritory] = useState<Territory>('Southern California');

  return (
    <TerritoryContext.Provider value={{ territory, setTerritory }}>
      {children}
    </TerritoryContext.Provider>
  );
}

// Navigation items definition
const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'News Feed', href: '/news', icon: Newspaper },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Pipeline', href: '/pipeline', icon: GitBranch },
  { label: 'Agencies', href: '/agencies', icon: Building2 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

// Main Sidebar component
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { territory, setTerritory } = useTerritoryContext();

  const territories: Territory[] = ['Southern California', 'Northern California', 'PNW'];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-[#0a0a0f] border-r border-[#2a2a3a] transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a2a3a]">
        {!isCollapsed && (
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-[#e8e8f0]">CIP Intel Tracker</h1>
            <p className="text-xs text-[#9898ac]">VSCE, Inc.</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-[#111119] rounded-lg transition-colors text-[#9898ac] hover:text-[#e8e8f0]"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-[#9898ac] hover:text-[#e8e8f0] hover:bg-[#111119]'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Territory Selector */}
      <div className="border-t border-[#2a2a3a] p-4">
        {!isCollapsed && (
          <p className="text-xs text-[#6b6b80] font-semibold uppercase mb-2">Territory</p>
        )}
        <select
          value={territory}
          onChange={(e) => setTerritory(e.target.value as Territory)}
          className={`w-full px-3 py-2 rounded-lg bg-[#111119] border border-[#2a2a3a] text-[#e8e8f0] text-sm hover:border-[#3a3a4a] focus:border-indigo-500 focus:outline-none transition-colors ${
            isCollapsed ? 'p-2 text-center' : ''
          }`}
          title={isCollapsed ? 'Territory' : undefined}
        >
          {territories.map((t) => (
            <option key={t} value={t}>
              {isCollapsed ? t.split(' ')[0] : t}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
