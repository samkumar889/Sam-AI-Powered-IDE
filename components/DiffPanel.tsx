'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitCompare, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X, 
  ChevronDown,
  FileText,
  Plus,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiffLine {
  lineNumber: number;
  content: string;
  type: 'added' | 'removed' | 'unchanged' | 'modified';
}

interface DiffFile {
  id: string;
  path: string;
  status: 'modified' | 'added' | 'deleted';
  additions: number;
  deletions: number;
  lines: DiffLine[];
}

export default function DiffPanel() {
  const [activeFile, setActiveFile] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('unified');
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set([0]));

  const diffFiles: DiffFile[] = [
    {
      id: '1',
      path: 'components/ActivityBar.tsx',
      status: 'modified',
      additions: 15,
      deletions: 3,
      lines: [
        { lineNumber: 1, content: "'use client';", type: 'unchanged' },
        { lineNumber: 2, content: '', type: 'unchanged' },
        { lineNumber: 3, content: 'import { useState } from "react";', type: 'unchanged' },
        { lineNumber: 4, content: 'import { motion } from "framer-motion";', type: 'added' },
        { lineNumber: 5, content: 'import { MessageSquare, Folder, Search, Settings, GitBranch, Sparkles } from "lucide-react";', type: 'added' },
        { lineNumber: 6, content: 'import { cn } from "@/lib/utils";', type: 'added' },
        { lineNumber: 7, content: '', type: 'unchanged' },
        { lineNumber: 8, content: 'export default function ActivityBar() {', type: 'unchanged' },
        { lineNumber: 9, content: '  return (', type: 'unchanged' },
        { lineNumber: 10, content: '    <div className="flex flex-col items-center py-3 bg-sidebar border-r border-border h-full">', type: 'modified' },
        { lineNumber: 11, content: '      {/* Activity icons */}', type: 'added' },
        { lineNumber: 12, content: '    </div>', type: 'unchanged' },
        { lineNumber: 13, content: '  );', type: 'unchanged' },
        { lineNumber: 14, content: '}', type: 'unchanged' },
      ],
    },
    {
      id: '2',
      path: 'components/LeftSidebar.tsx',
      status: 'modified',
      additions: 8,
      deletions: 2,
      lines: [
        { lineNumber: 1, content: "'use client';", type: 'unchanged' },
        { lineNumber: 2, content: '', type: 'unchanged' },
        { lineNumber: 3, content: 'import { useState } from "react";', type: 'unchanged' },
        { lineNumber: 4, content: 'import { motion, AnimatePresence } from "framer-motion";', type: 'added' },
        { lineNumber: 5, content: 'import { Plus, Search, Clock, MessageSquare, FolderKanban, ChevronDown } from "lucide-react";', type: 'modified' },
        { lineNumber: 6, content: 'import { cn } from "@/lib/utils";', type: 'added' },
        { lineNumber: 7, content: '', type: 'unchanged' },
        { lineNumber: 8, content: 'export default function LeftSidebar() {', type: 'unchanged' },
      ],
    },
  ];

  const toggleFile = (index: number) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const getLineIcon = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return <Plus size={12} className="text-green-500" />;
      case 'removed':
        return <Minus size={12} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getLineClass = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-500/10';
      case 'removed':
        return 'bg-red-500/10';
      case 'modified':
        return 'bg-yellow-500/10';
      default:
        return '';
    }
  };

  const activeDiffFile = diffFiles[activeFile];

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <GitCompare size={16} className="text-accent" />
            Changes
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('unified')}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                viewMode === 'unified'
                  ? "bg-sidebar-active text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover"
              )}
            >
              Unified
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                viewMode === 'split'
                  ? "bg-sidebar-active text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover"
              )}
            >
              Split
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="space-y-1">
          {diffFiles.map((file, index) => {
            const isExpanded = expandedFiles.has(index);
            const isActive = activeFile === index;
            
            return (
              <div key={file.id}>
                <button
                  onClick={() => {
                    setActiveFile(index);
                    toggleFile(index);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive && isExpanded ? "bg-sidebar-active text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover"
                  )}
                >
                  <FileText size={14} className={cn(
                    file.status === 'added' && "text-green-500",
                    file.status === 'deleted' && "text-red-500",
                    file.status === 'modified' && "text-yellow-500"
                  )} />
                  <span className="flex-1 text-left truncate">{file.path}</span>
                  <div className="flex items-center gap-2 text-xs">
                    {file.additions > 0 && (
                      <span className="text-green-500">+{file.additions}</span>
                    )}
                    {file.deletions > 0 && (
                      <span className="text-red-500">-{file.deletions}</span>
                    )}
                  </div>
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronDown size={12} className="rotate-[-90deg]" />}
                </button>

                <AnimatePresence>
                  {isExpanded && isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-3 bg-panel border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-text-muted">{file.path}</span>
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-text-muted hover:text-green-500 transition-colors">
                              <Check size={14} />
                            </button>
                            <button className="p-1 text-text-muted hover:text-red-500 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Diff View */}
                        <div className="font-mono text-xs space-y-0.5">
                          {file.lines.map((line) => (
                            <div
                              key={line.lineNumber}
                              className={cn(
                                "flex items-center gap-2 px-2 py-0.5 rounded",
                                getLineClass(line.type)
                              )}
                            >
                              <span className="w-8 text-text-muted text-right">{line.lineNumber}</span>
                              {getLineIcon(line.type)}
                              <span className={cn(
                                "flex-1",
                                line.type === 'removed' && "text-red-400 line-through",
                                line.type === 'added' && "text-green-400"
                              )}>
                                {line.content}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm transition-colors">
            <Check size={14} />
            Stage All
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-panel border border-border hover:border-border-light text-text-primary rounded-lg text-sm transition-colors">
            <X size={14} />
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
