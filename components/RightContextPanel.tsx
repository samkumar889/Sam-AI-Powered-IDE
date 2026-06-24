'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  File, 
  Folder, 
  FolderOpen,
  GitCommit,
  GitBranch,
  CheckCircle,
  Clock,
  X,
  Plus,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  modified?: boolean;
}

interface Change {
  id: string;
  file: string;
  type: 'modified' | 'added' | 'deleted';
  status: 'staged' | 'unstaged';
}

interface AgentTask {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
}

export default function RightContextPanel({ isCollapsed }: { isCollapsed: boolean }) {
  const [activeTab, setActiveTab] = useState<'explorer' | 'changes' | 'tasks'>('explorer');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'src', 'components']));

  const fileTree: FileNode[] = [
    {
      id: 'root',
      name: 'samai',
      type: 'folder',
      children: [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          children: [
            {
              id: 'components',
              name: 'components',
              type: 'folder',
              children: [
                { id: 'activity-bar', name: 'ActivityBar.tsx', type: 'file', modified: true },
                { id: 'left-sidebar', name: 'LeftSidebar.tsx', type: 'file', modified: true },
                { id: 'chat-panel', name: 'CenterChatPanel.tsx', type: 'file', modified: true },
                { id: 'context-panel', name: 'RightContextPanel.tsx', type: 'file' },
              ],
            },
            { id: 'app', name: 'app', type: 'folder', children: [
              { id: 'page', name: 'page.tsx', type: 'file' },
              { id: 'layout', name: 'layout.tsx', type: 'file' },
              { id: 'globals', name: 'globals.css', type: 'file' },
            ]},
            { id: 'lib', name: 'lib', type: 'folder', children: [
              { id: 'utils', name: 'utils.ts', type: 'file' },
            ]},
          ],
        },
        { id: 'public', name: 'public', type: 'folder', children: [] },
        { id: 'package', name: 'package.json', type: 'file' },
        { id: 'readme', name: 'README.md', type: 'file' },
      ],
    },
  ];

  const changes: Change[] = [
    { id: '1', file: 'components/ActivityBar.tsx', type: 'modified', status: 'staged' },
    { id: '2', file: 'components/LeftSidebar.tsx', type: 'modified', status: 'staged' },
    { id: '3', file: 'components/CenterChatPanel.tsx', type: 'modified', status: 'unstaged' },
    { id: '4', file: 'app/globals.css', type: 'modified', status: 'unstaged' },
  ];

  const agentTasks: AgentTask[] = [
    { id: '1', title: 'Analyze project structure', status: 'completed', progress: 100 },
    { id: '2', title: 'Generate component architecture', status: 'completed', progress: 100 },
    { id: '3', title: 'Implement Activity Bar', status: 'completed', progress: 100 },
    { id: '4', title: 'Build Chat Panel', status: 'in-progress', progress: 75 },
    { id: '5', title: 'Add Monaco Editor integration', status: 'pending', progress: 0 },
  ];

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderFileTree = (nodes: FileNode[], level: number = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedFolders.has(node.id);
      const paddingLeft = level * 12;

      if (node.type === 'folder') {
        return (
          <div key={node.id}>
            <button
              onClick={() => toggleFolder(node.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-sidebar-hover rounded transition-colors"
              style={{ paddingLeft: `${paddingLeft + 8}px` }}
            >
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              {isExpanded ? <FolderOpen size={16} className="text-accent" /> : <Folder size={16} className="text-accent" />}
              <span className="text-sm text-text-primary">{node.name}</span>
            </button>
            <AnimatePresence>
              {isExpanded && node.children && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {renderFileTree(node.children, level + 1)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      return (
        <button
          key={node.id}
          className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-sidebar-hover rounded transition-colors group"
          style={{ paddingLeft: `${paddingLeft + 20}px` }}
        >
          <File size={16} className={cn("text-text-muted", node.modified && "text-accent")} />
          <span className={cn("text-sm text-text-secondary", node.modified && "text-text-primary")}>
            {node.name}
          </span>
          {node.modified && <div className="ml-auto w-2 h-2 bg-accent rounded-full" />}
        </button>
      );
    });
  };

  const getChangeIcon = (type: Change['type']) => {
    switch (type) {
      case 'modified':
        return <GitBranch size={14} className="text-yellow-500" />;
      case 'added':
        return <Plus size={14} className="text-green-500" />;
      case 'deleted':
        return <X size={14} className="text-red-500" />;
    }
  };

  const getStatusIcon = (status: Change['status']) => {
    switch (status) {
      case 'staged':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'unstaged':
        return <Clock size={14} className="text-text-muted" />;
    }
  };

  const getTaskStatusIcon = (status: AgentTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'in-progress':
        return <RefreshCw size={14} className="text-accent animate-spin" />;
      case 'pending':
        return <Clock size={14} className="text-text-muted" />;
    }
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-[320px] bg-sidebar border-l border-border flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-2 py-2 border-b border-border">
        {[
          { id: 'explorer', label: 'Explorer' },
          { id: 'changes', label: 'Changes' },
          { id: 'tasks', label: 'Tasks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-lg transition-colors flex-1",
              activeTab === tab.id
                ? "bg-sidebar-active text-text-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'explorer' && (
          <div className="p-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-medium text-text-muted uppercase">Project Structure</span>
              <button className="p-1 text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors">
                <MoreVertical size={14} />
              </button>
            </div>
            {renderFileTree(fileTree)}
          </div>
        )}

        {activeTab === 'changes' && (
          <div className="p-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-medium text-text-muted uppercase">Changes</span>
              <div className="flex items-center gap-1">
                <button className="p-1 text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors">
                  <GitCommit size={14} />
                </button>
                <button className="p-1 text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {changes.map((change) => (
                <div
                  key={change.id}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-sidebar-hover rounded transition-colors group"
                >
                  {getChangeIcon(change.type)}
                  <span className="flex-1 text-sm text-text-secondary truncate">{change.file}</span>
                  {getStatusIcon(change.status)}
                  <button className="p-1 text-text-muted opacity-0 group-hover:opacity-100 hover:text-text-primary transition-all">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 px-2">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors text-sm font-medium">
                <GitCommit size={14} />
                Commit Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="p-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-medium text-text-muted uppercase">Agent Tasks</span>
              <button className="p-1 text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="space-y-2">
              {agentTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-panel border border-border rounded-lg hover:border-border-light transition-colors"
                >
                  <div className="flex items-start gap-2 mb-2">
                    {getTaskStatusIcon(task.status)}
                    <span className="flex-1 text-sm text-text-primary">{task.title}</span>
                  </div>
                  
                  {task.status === 'in-progress' && (
                    <div className="w-full h-1.5 bg-sidebar rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                  )}
                  
                  {task.status === 'completed' && (
                    <div className="w-full h-1.5 bg-sidebar rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 px-2 py-2 bg-panel rounded-lg">
          <GitCommit size={14} className="text-accent" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-primary truncate">main</p>
            <p className="text-xs text-text-muted">4 changes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
