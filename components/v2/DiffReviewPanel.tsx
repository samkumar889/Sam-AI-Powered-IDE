'use client';

import { useState, useRef } from 'react';
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
  Minus,
  RotateCcw,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface DiffLine {
  lineNumberLeft: number | null;
  lineNumberRight: number | null;
  contentLeft: string | null;
  contentRight: string | null;
  type: 'added' | 'removed' | 'unchanged';
}

interface DiffFile {
  id: string;
  path: string;
  status: 'modified' | 'added' | 'deleted';
  additions: number;
  deletions: number;
  lines: DiffLine[];
  accepted: boolean;
  rejected: boolean;
}

// Demo data for testing
const initialDiffFiles: DiffFile[] = [
  {
    id: '1',
    path: 'components/ActivityBar.tsx',
    status: 'modified',
    additions: 15,
    deletions: 3,
    accepted: false,
    rejected: false,
    lines: [
      {
        lineNumberLeft: 1,
        lineNumberRight: 1,
        contentLeft: "'use client';",
        contentRight: "'use client';",
        type: 'unchanged',
      },
      {
        lineNumberLeft: 2,
        lineNumberRight: 2,
        contentLeft: '',
        contentRight: '',
        type: 'unchanged',
      },
      {
        lineNumberLeft: 3,
        lineNumberRight: 3,
        contentLeft: 'import { useState } from "react";',
        contentRight: 'import { useState } from "react";',
        type: 'unchanged',
      },
      {
        lineNumberLeft: null,
        lineNumberRight: 4,
        contentLeft: null,
        contentRight: 'import { motion } from "framer-motion";',
        type: 'added',
      },
      {
        lineNumberLeft: 4,
        lineNumberRight: null,
        contentLeft: 'import { MessageSquare } from "lucide-react";',
        contentRight: null,
        type: 'removed',
      },
      {
        lineNumberLeft: null,
        lineNumberRight: 5,
        contentLeft: null,
        contentRight: 'import { MessageSquare, Folder, Search, Settings, GitBranch, Sparkles } from "lucide-react";',
        type: 'added',
      },
      {
        lineNumberLeft: 5,
        lineNumberRight: 6,
        contentLeft: 'import { cn } from "@/lib/utils";',
        contentRight: 'import { cn } from "@/lib/utils";',
        type: 'unchanged',
      },
      {
        lineNumberLeft: 6,
        lineNumberRight: 7,
        contentLeft: '',
        contentRight: '',
        type: 'unchanged',
      },
      {
        lineNumberLeft: 7,
        lineNumberRight: 8,
        contentLeft: 'export default function ActivityBar() {',
        contentRight: 'export default function ActivityBar() {',
        type: 'unchanged',
      },
      {
        lineNumberLeft: 8,
        lineNumberRight: null,
        contentLeft: '  return (',
        contentRight: null,
        type: 'removed',
      },
      {
        lineNumberLeft: null,
        lineNumberRight: 9,
        contentLeft: null,
        contentRight: '  const [activeItem, setActiveItem] = useState("chat");',
        type: 'added',
      },
      {
        lineNumberLeft: null,
        lineNumberRight: 10,
        contentLeft: null,
        contentRight: '  return (',
        type: 'added',
      },
      {
        lineNumberLeft: 9,
        lineNumberRight: 11,
        contentLeft: '    <div className="flex flex-col items-center py-3 bg-sidebar border-r border-border h-full">',
        contentRight: '    <div className="flex flex-col items-center py-3 bg-bg-elevated-1 border-r border-border-default h-full">',
        type: 'unchanged',
      },
    ],
  },
  {
    id: '2',
    path: 'components/LeftSidebar.tsx',
    status: 'modified',
    additions: 8,
    deletions: 2,
    accepted: false,
    rejected: false,
    lines: [
      {
        lineNumberLeft: 1,
        lineNumberRight: 1,
        contentLeft: "'use client';",
        contentRight: "'use client';",
        type: 'unchanged',
      },
      {
        lineNumberLeft: 2,
        lineNumberRight: 2,
        contentLeft: '',
        contentRight: '',
        type: 'unchanged',
      },
      {
        lineNumberLeft: 3,
        lineNumberRight: 3,
        contentLeft: 'import { useState } from "react";',
        contentRight: 'import { useState } from "react";',
        type: 'unchanged',
      },
      {
        lineNumberLeft: null,
        lineNumberRight: 4,
        contentLeft: null,
        contentRight: 'import { motion, AnimatePresence } from "framer-motion";',
        type: 'added',
      },
    ],
  },
  {
    id: '3',
    path: 'components/NewFeature.tsx',
    status: 'added',
    additions: 25,
    deletions: 0,
    accepted: false,
    rejected: false,
    lines: [
      {
        lineNumberLeft: null,
        lineNumberRight: 1,
        contentLeft: null,
        contentRight: "'use client';",
        type: 'added',
      },
      {
        lineNumberLeft: null,
        lineNumberRight: 2,
        contentLeft: null,
        contentRight: '',
        type: 'added',
      },
      {
        lineNumberLeft: null,
        lineNumberRight: 3,
        contentLeft: null,
        contentRight: 'import React from "react";',
        type: 'added',
      },
    ],
  },
];

export function DiffReviewPanel() {
  const [diffFiles, setDiffFiles] = useState<DiffFile[]>(initialDiffFiles);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set([0]));
  const [historyStack, setHistoryStack] = useState<DiffFile[][]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const fileListRef = useRef<HTMLDivElement>(null);

  // Helper: Save state to history
  const saveToHistory = (newFiles: DiffFile[]) => {
    const trimmedHistory = historyStack.slice(0, currentHistoryIndex + 1);
    const newHistory = [...trimmedHistory, [...diffFiles]];
    setHistoryStack(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  // Helper: Undo last action
  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setDiffFiles(historyStack[currentHistoryIndex - 1]);
    }
  };

  // Toggle file expand
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

  // Accept a single file change
  const acceptFile = (fileId: string) => {
    saveToHistory(diffFiles);
    setDiffFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, accepted: true, rejected: false }
          : file
      )
    );
  };

  // Reject a single file change
  const rejectFile = (fileId: string) => {
    saveToHistory(diffFiles);
    setDiffFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, accepted: false, rejected: true }
          : file
      )
    );
  };

  // Undo a file's accept/reject
  const undoFile = (fileId: string) => {
    saveToHistory(diffFiles);
    setDiffFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, accepted: false, rejected: false }
          : file
      )
    );
  };

  // Accept all changes
  const acceptAll = () => {
    saveToHistory(diffFiles);
    setDiffFiles((prev) =>
      prev.map((file) => ({ ...file, accepted: true, rejected: false }))
    );
  };

  // Reject all changes
  const rejectAll = () => {
    saveToHistory(diffFiles);
    setDiffFiles((prev) =>
      prev.map((file) => ({ ...file, accepted: false, rejected: true }))
    );
  };

  // Calculate stats
  const stats = diffFiles.reduce(
    (acc, file) => {
      acc.totalFiles += 1;
      acc.totalAdditions += file.additions;
      acc.totalDeletions += file.deletions;
      if (file.accepted) acc.acceptedFiles += 1;
      if (file.rejected) acc.rejectedFiles += 1;
      return acc;
    },
    {
      totalFiles: 0,
      totalAdditions: 0,
      totalDeletions: 0,
      acceptedFiles: 0,
      rejectedFiles: 0,
    }
  );

  const activeFile = diffFiles[activeFileIndex];

  return (
    <div className="flex flex-col h-full bg-bg-elevated-2 border-l border-border-default">
      {/* Header */}
      <div className="flex flex-col border-b border-border-default bg-bg-elevated-1">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <GitCompare size={18} className="text-accent-primary" />
            <h2 className="text-sm font-semibold text-text-primary">
              Review Changes ({stats.totalFiles} files)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo Button */}
            <button
              onClick={handleUndo}
              disabled={currentHistoryIndex <= 0}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-border-default bg-bg-elevated-2 hover:bg-bg-elevated-2/80 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RotateCcw size={12} />
              Undo
            </button>

            {/* View Mode Tabs */}
            <div className="flex rounded-md border border-border-default overflow-hidden">
              <button
                onClick={() => setViewMode('split')}
                className={cn(
                  "px-3 py-1 text-xs transition-colors",
                  viewMode === 'split'
                    ? "bg-accent-primary text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated-2"
                )}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={cn(
                  "px-3 py-1 text-xs transition-colors",
                  viewMode === 'unified'
                    ? "bg-accent-primary text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated-2"
                )}
              >
                Unified
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 px-4 pb-3">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-green-500">
              <Plus size={12} />
              {stats.totalAdditions}
            </span>
            <span className="flex items-center gap-1 text-red-500">
              <Minus size={12} />
              {stats.totalDeletions}
            </span>
          </div>
          <div className="h-4 w-px bg-border-default" />
          <div className="flex items-center gap-4 text-xs">
            <span className="text-text-muted">
              Accepted:{" "}
              <span className="text-green-500 font-medium">
                {stats.acceptedFiles}
              </span>
            </span>
            <span className="text-text-muted">
              Rejected:{" "}
              <span className="text-red-500 font-medium">
                {stats.rejectedFiles}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File List */}
        <div
          ref={fileListRef}
          className="w-72 flex-shrink-0 border-r border-border-default overflow-y-auto"
        >
          <div className="p-3 space-y-1">
            {diffFiles.map((file, index) => {
              const isExpanded = expandedFiles.has(index);
              const isActive = activeFileIndex === index;

              return (
                <div key={file.id} className="group">
                  <button
                    onClick={() => {
                      setActiveFileIndex(index);
                      if (!isExpanded) toggleFile(index);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      isActive
                        ? "bg-accent-primary/10 text-text-primary border border-accent-primary/30"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated-1"
                    )}
                  >
                    <ChevronRight
                      size={12}
                      className={cn(
                        "transition-transform text-text-muted",
                        isExpanded && "rotate-90"
                      )}
                    />
                    <FileText
                      size={14}
                      className={cn(
                        file.status === "added" && "text-green-500",
                        file.status === "deleted" && "text-red-500",
                        file.status === "modified" && "text-yellow-500"
                      )}
                    />
                    <span className="flex-1 text-left truncate">{file.path}</span>
                    <div className="flex items-center gap-1">
                      {file.additions > 0 && (
                        <span className="text-green-500 text-xs">
                          +{file.additions}
                        </span>
                      )}
                      {file.deletions > 0 && (
                        <span className="text-red-500 text-xs">
                          -{file.deletions}
                        </span>
                      )}
                    </div>

                    {/* Status Indicators */}
                    {file.accepted && (
                      <Check size={12} className="text-green-500" />
                    )}
                    {file.rejected && <X size={12} className="text-red-500" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mt-1 ml-3"
                      >
                        <div className="flex gap-1 p-1">
                          {file.accepted || file.rejected ? (
                            <button
                              onClick={() => undoFile(file.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded-md border border-border-default bg-bg-elevated-1 hover:bg-bg-elevated-2 text-text-secondary hover:text-text-primary transition-colors"
                            >
                              <RotateCcw size={12} />
                              Undo
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => acceptFile(file.id)}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded-md border border-border-default bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-colors"
                              >
                                <Check size={12} />
                                Accept
                              </button>
                              <button
                                onClick={() => rejectFile(file.id)}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded-md border border-border-default bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <X size={12} />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diff Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeFile ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* File Header */}
              <div className="px-4 py-3 border-b border-border-default bg-bg-elevated-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText
                    size={16}
                    className={cn(
                      activeFile.status === "added" && "text-green-500",
                      activeFile.status === "deleted" && "text-red-500",
                      activeFile.status === "modified" && "text-yellow-500"
                    )}
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {activeFile.path}
                  </span>
                  <span className="text-xs text-text-muted capitalize">
                    {activeFile.status}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {activeFile.accepted && (
                    <button
                      onClick={() => undoFile(activeFile.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-border-default bg-bg-elevated-2 hover:bg-bg-elevated-2/80 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <RotateCcw size={12} />
                      Undo Accept
                    </button>
                  )}
                  {activeFile.rejected && (
                    <button
                      onClick={() => undoFile(activeFile.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-border-default bg-bg-elevated-2 hover:bg-bg-elevated-2/80 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <RotateCcw size={12} />
                      Undo Reject
                    </button>
                  )}
                  {!activeFile.accepted && !activeFile.rejected && (
                    <>
                      <button
                        onClick={() => acceptFile(activeFile.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-border-default bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Check size={12} />
                        Accept File
                      </button>
                      <button
                        onClick={() => rejectFile(activeFile.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-border-default bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={12} />
                        Reject File
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Diff View */}
              <div className="flex-1 overflow-auto">
                {viewMode === "split" ? (
                  <div className="grid grid-cols-2 divide-x divide-border-default">
                    {/* Left Side - Original */}
                    <div className="bg-bg-elevated-0">
                      <div className="sticky top-0 z-10 bg-bg-elevated-1 px-4 py-2 border-b border-border-default">
                        <span className="text-xs font-medium text-text-secondary">
                          Original
                        </span>
                      </div>
                      <div className="font-mono text-xs">
                        {activeFile.lines.map((line, index) =>
                          line.type !== "added" ? (
                            <div
                              key={index}
                              className={cn(
                                "flex items-center border-b border-border-default/30",
                                line.type === "removed"
                                  ? "bg-red-500/10"
                                  : "bg-transparent"
                              )}
                            >
                              <span className="w-10 px-2 text-right text-text-muted/60">
                                {line.lineNumberLeft}
                              </span>
                              <span className="w-4 flex items-center justify-center">
                                {line.type === "removed" && (
                                  <Minus size={10} className="text-red-500" />
                                )}
                              </span>
                              <span className="flex-1 px-2 py-1">
                                {line.contentLeft}
                              </span>
                            </div>
                          ) : (
                            <div key={index} className="h-6" />
                          )
                        )}
                      </div>
                    </div>

                    {/* Right Side - Modified */}
                    <div className="bg-bg-elevated-0">
                      <div className="sticky top-0 z-10 bg-bg-elevated-1 px-4 py-2 border-b border-border-default">
                        <span className="text-xs font-medium text-text-secondary">
                          Modified
                        </span>
                      </div>
                      <div className="font-mono text-xs">
                        {activeFile.lines.map((line, index) =>
                          line.type !== "removed" ? (
                            <div
                              key={index}
                              className={cn(
                                "flex items-center border-b border-border-default/30",
                                line.type === "added"
                                  ? "bg-green-500/10"
                                  : "bg-transparent"
                              )}
                            >
                              <span className="w-10 px-2 text-right text-text-muted/60">
                                {line.lineNumberRight}
                              </span>
                              <span className="w-4 flex items-center justify-center">
                                {line.type === "added" && (
                                  <Plus size={10} className="text-green-500" />
                                )}
                              </span>
                              <span className="flex-1 px-2 py-1">
                                {line.contentRight}
                              </span>
                            </div>
                          ) : (
                            <div key={index} className="h-6" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-bg-elevated-0 font-mono text-xs">
                    {activeFile.lines.map((line, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center border-b border-border-default/30",
                          line.type === "added" && "bg-green-500/10",
                          line.type === "removed" && "bg-red-500/10"
                        )}
                      >
                        <span className="w-20 px-2 text-right text-text-muted/60 flex gap-1">
                          <span className="w-8">
                            {line.lineNumberLeft ?? "-"}
                          </span>
                          <span className="w-8">
                            {line.lineNumberRight ?? "-"}
                          </span>
                        </span>
                        <span className="w-4 flex items-center justify-center">
                          {line.type === "added" && (
                            <Plus size={10} className="text-green-500" />
                          )}
                          {line.type === "removed" && (
                            <Minus size={10} className="text-red-500" />
                          )}
                        </span>
                        <span className="flex-1 px-2 py-1">
                          {line.contentLeft ?? line.contentRight}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <GitCompare size={48} className="text-text-muted/30 mb-3" />
              <p className="text-text-secondary">Select a file to review</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="border-t border-border-default p-4 bg-bg-elevated-1">
        <div className="flex items-center justify-between">
          <div className="text-xs text-text-muted">
            Changes saved locally. You can undo any action.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-sm border border-border-default rounded-md bg-bg-elevated-2 hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
