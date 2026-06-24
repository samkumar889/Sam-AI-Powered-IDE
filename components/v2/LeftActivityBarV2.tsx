'use client';

import React from 'react';
import {
  Folder,
  Search,
  GitBranch,
  Database,
  Puzzle,
  Server,
  Settings,
} from 'lucide-react';

type ActivityTab =
  | 'explorer'
  | 'search'
  | 'git'
  | 'database'
  | 'extensions'
  | 'mcp'
  | 'settings';

interface LeftActivityBarV2Props {
  activeTab: ActivityTab;
  onTabChange: (tab: ActivityTab) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const LeftActivityBarV2 = ({
  activeTab,
  onTabChange,
}: LeftActivityBarV2Props) => {
  const tabs = [
    { id: 'explorer', icon: Folder, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'git', icon: GitBranch, label: 'Source Control' },
    { id: 'database', icon: Database, label: 'Database' },
    { id: 'extensions', icon: Puzzle, label: 'Extensions' },
    { id: 'mcp', icon: Server, label: 'MCP Servers' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <div className="w-12 flex flex-col items-center py-2 gap-1 bg-bg-elevated-1 border-r border-border-default">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative w-10 h-10 flex items-center justify-center rounded-md
            transition-all duration-200 group
            ${
              activeTab === tab.id
                ? 'text-accent-primary'
                : 'text-text-muted hover:text-text-secondary'
            }
          `}
        >
          {activeTab === tab.id && (
            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-accent-primary rounded-r-full" />
          )}
          <tab.icon className="w-5 h-5" />
          
          {/* Tooltip */}
          <div className="absolute left-12 px-3 py-1.5 rounded-lg bg-bg-elevated-2 border border-border-default text-xs text-text-primary whitespace-nowrap z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  );
};
