'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { TopBarV2 } from './TopBarV2';
import { LeftActivityBarV2 } from './LeftActivityBarV2';
import { LeftSidebarV2 } from './LeftSidebarV2';
import { EditorTabsV2 } from './EditorTabsV2';
import { RightPanelV2 } from './RightPanelV2';
import { CommandPalette } from './CommandPalette';
import { DiffReviewPanel } from './DiffReviewPanel';
import MonacoEditorPanel from '@/components/MonacoEditorPanel';
import TerminalAgentPanel from '@/components/TerminalAgentPanel';
import { GitCompare, Code2 } from 'lucide-react';
import { getLanguageFromExtension } from '@/lib/fileTypes';

export const WorkspaceLayoutV2 = () => {
  const {
    v2LeftSidebarActiveTab,
    setV2LeftSidebarActiveTab,
    v2EditorTabs,
    setV2EditorTabs,
    v2ActiveEditorTab,
    setV2ActiveEditorTab,
    v2BottomPanelVisible,
    toggleV2BottomPanel,
    v2RightPanelVisible,
    toggleV2RightPanel,
    openFiles,
    activeFile,
    initializeWorkspaceMemory,
  } = useAppStore();

  // Toggle between editor and review mode
  const [viewMode, setViewMode] = useState<'editor' | 'review'>('editor');

  // Sync openFiles to v2EditorTabs
  React.useEffect(() => {
    if (openFiles.length > 0) {
      setV2EditorTabs(openFiles);
      if (activeFile && !v2ActiveEditorTab) {
        setV2ActiveEditorTab(activeFile.id);
      }
    }
  }, [openFiles, activeFile, setV2EditorTabs, setV2ActiveEditorTab, v2ActiveEditorTab]);

  // Initialize workspace memory
  React.useEffect(() => {
    initializeWorkspaceMemory();
  }, [initializeWorkspaceMemory]);

  const handleCloseTab = (id: string) => {
    const newTabs = v2EditorTabs.filter((t) => t.id !== id);
    setV2EditorTabs(newTabs);
    if (v2ActiveEditorTab === id && newTabs.length > 0) {
      setV2ActiveEditorTab(newTabs[newTabs.length - 1].id);
    } else if (newTabs.length === 0) {
      setV2ActiveEditorTab(null);
    }
  };


  const activeEditorFile = v2EditorTabs.find((t) => t.id === v2ActiveEditorTab);

  return (
    <div className="flex flex-col h-screen w-full bg-bg-elevated-0">
      <TopBarV2 />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftActivityBarV2
          activeTab={v2LeftSidebarActiveTab}
          onTabChange={setV2LeftSidebarActiveTab}
        />
        
        {viewMode === 'editor' && <LeftSidebarV2 activeTab={v2LeftSidebarActiveTab} />}
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="px-3 py-1 border-b border-border-default bg-bg-elevated-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('editor')}
                className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-md text-xs
                  ${
                    viewMode === 'editor'
                      ? 'bg-accent-primary/20 text-accent-primary'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated-2'
                  }
                `}
              >
                <Code2 className="w-3.5 h-3.5" />
                Editor
              </button>
              <button
                onClick={() => setViewMode('review')}
                className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-md text-xs
                  ${
                    viewMode === 'review'
                      ? 'bg-accent-primary/20 text-accent-primary'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated-2'
                  }
                `}
              >
                <GitCompare className="w-3.5 h-3.5" />
                Review
              </button>
            </div>
            {viewMode === 'editor' && (
              <EditorTabsV2
                tabs={v2EditorTabs}
                activeTab={v2ActiveEditorTab}
                onTabClick={setV2ActiveEditorTab}
                onCloseTab={handleCloseTab}
              />
            )}
          </div>
          
          <div className="flex-1 overflow-hidden bg-bg-elevated-2">
            {viewMode === 'review' ? (
              <DiffReviewPanel />
            ) : activeEditorFile ? (
              <MonacoEditorPanel
                file={{
                  name: activeEditorFile.name,
                  content: activeEditorFile.content || '',
                  language: getLanguageFromExtension(activeEditorFile.name),
                }}
                fileId={activeEditorFile.id}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-text-muted">
                <div className="mb-3 text-6xl opacity-20">⌨️</div>
                <h3 className="text-lg font-medium text-text-secondary mb-1">
                  No file selected
                </h3>
                <p className="text-sm">
                  Select a file from the Explorer to start coding
                </p>
              </div>
            )}
          </div>
          
          {viewMode === 'editor' && v2BottomPanelVisible && (
            <div className="h-64 border-t border-border-default bg-bg-elevated-1">
              <TerminalAgentPanel />
            </div>
          )}
        </div>
        
        {viewMode === 'editor' && (
          <RightPanelV2
            visible={v2RightPanelVisible}
            onToggle={toggleV2RightPanel}
          />
        )}
      </div>
      <CommandPalette />
    </div>
  );
};
