'use client';

import { useAppStore } from '@/store/useAppStore';
import { Folder, Search, GitBranch, Briefcase, Plus, Database, FolderOpen } from 'lucide-react';
import { FileTree } from './FileTree';
import GitPanel from './GitPanel';
import { ProjectMemoryPanel } from './ProjectMemoryPanel';
import { SearchPanel } from './SearchPanel';

export function Sidebar() {
  const { sidebarActiveTab, setSidebarActiveTab, openFolder } = useAppStore();

  const tabs = [
    { id: 'projects' as const, icon: Briefcase, label: 'Projects' },
    { id: 'files' as const, icon: Folder, label: 'Files' },
    { id: 'search' as const, icon: Search, label: 'Search' },
    { id: 'git' as const, icon: GitBranch, label: 'Git' },
    { id: 'memory' as const, icon: Database, label: 'Memory' },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar Icons */}
      <div className="flex h-full w-14 flex-col items-center gap-2 border-r border-gray-700 bg-[#1e293b] py-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSidebarActiveTab(tab.id)}
            className={
              'relative flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:bg-gray-700 text-gray-400' +
              (sidebarActiveTab === tab.id ? 'bg-gray-700 text-gray-200' : '')
            }
            title={tab.label}
          >
            <tab.icon className="h-5 w-5" />
          </button>
        ))}

        <div className="mt-auto flex flex-col gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-700 text-gray-400">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Active Panel */}
      {sidebarActiveTab === 'git' ? (
        <GitPanel />
      ) : sidebarActiveTab === 'search' ? (
        <div className="flex h-full w-96 flex-col border-r border-gray-700 bg-[#0f172a]">
          <SearchPanel />
        </div>
      ) : sidebarActiveTab === 'memory' ? (
        <ProjectMemoryPanel />
      ) : (
        <div className="flex h-full w-80 flex-col border-r border-gray-700 bg-[#0f172a]">
          <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              {sidebarActiveTab === 'files' ? 'Explorer' : 'Projects'}
            </span>
            {sidebarActiveTab === 'files' && (
              <button
                onClick={openFolder}
                className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
                title="Open Folder"
              >
                <FolderOpen className="h-4 w-4" />
              </button>
            )}
          </div>

          <FileTree />
        </div>
      )}
    </div>
  );
}
