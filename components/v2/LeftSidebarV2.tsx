'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { FileTree } from '@/components/FileTree';
import { SearchPanel } from '@/components/SearchPanel';
import GitPanel from '@/components/GitPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { CodebaseKnowledgePanel } from './CodebaseKnowledgePanel';
import {
  Puzzle,
  Server,
  FolderOpen,
} from 'lucide-react';

type ActivityTab =
  | 'explorer'
  | 'search'
  | 'git'
  | 'database'
  | 'extensions'
  | 'mcp'
  | 'settings';

interface LeftSidebarV2Props {
  activeTab: ActivityTab;
  width?: number;
}

const EmptyPanel = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4 text-text-muted">
    <div className="mb-3 text-text-muted/50">{icon}</div>
    <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
    <p className="text-xs mt-1">{description}</p>
  </div>
);

export const LeftSidebarV2 = ({ activeTab }: LeftSidebarV2Props) => {
  const { openFolder } = useAppStore();

  const renderPanel = () => {
    switch (activeTab) {
      case 'explorer':
        return (
          <>
            <div className="px-4 py-2 border-b border-border-default">
              <button
                onClick={openFolder}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-text-primary bg-bg-elevated-1 hover:bg-bg-elevated-1/80 rounded-md border border-border-default transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
                Open Folder
              </button>
            </div>
            <FileTree />
          </>
        );
      case 'search':
        return <SearchPanel />;
      case 'git':
        return <GitPanel />;
      case 'database':
        return <CodebaseKnowledgePanel />;
      case 'extensions':
        return (
          <EmptyPanel
            icon={<Puzzle className="w-8 h-8" />}
            title="Extensions Panel"
            description="Browse and install extensions"
          />
        );
      case 'mcp':
        return (
          <EmptyPanel
            icon={<Server className="w-8 h-8" />}
            title="MCP Servers"
            description="Manage your Model Context Protocol servers"
          />
        );
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="w-80 flex flex-col bg-bg-elevated-2 border-r border-border-default">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-border-default">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>
      </div>
      
      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {renderPanel()}
      </div>
    </div>
  );
};
