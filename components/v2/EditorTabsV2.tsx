'use client';

import React from 'react';
import { X } from 'lucide-react';
import { FileNode } from '@/store/useAppStore';
import { getFileIcon } from '@/lib/fileIcons';

interface EditorTabsV2Props {
  tabs: FileNode[];
  activeTab: string | null;
  onTabClick: (id: string) => void;
  onCloseTab: (id: string) => void;
}

export const EditorTabsV2 = ({
  tabs,
  activeTab,
  onTabClick,
  onCloseTab,
}: EditorTabsV2Props) => {
  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center bg-bg-elevated-1 border-b border-border-default overflow-x-auto no-scrollbar">
      {tabs.map((file) => {
        const isActive = file.id === activeTab;
        return (
          <div
            key={file.id}
            onClick={() => onTabClick(file.id)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm cursor-pointer
              transition-colors border-r border-border-default
              ${
                isActive
                  ? 'bg-bg-elevated-2 text-text-primary border-t-2 border-t-accent-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }
            `}
          >
            {getFileIcon(file.name)}
            <span className="truncate max-w-[150px]">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(file.id);
              }}
              className="p-0.5 rounded hover:bg-bg-elevated-1/50"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
