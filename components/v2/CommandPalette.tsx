'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Search,
  Terminal,
  GitBranch,
  Settings,
  Plus,
  FileCode,
  MessageSquare,
  Zap,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    setRightPanelActiveTab,
    toggleV2BottomPanel,
    setV2LeftSidebarActiveTab,
  } = useAppStore();

  const commands: Command[] = [
    {
      id: 'open-chat',
      name: 'Open Chat',
      description: 'Open the AI Chat panel',
      icon: <MessageSquare className="w-4 h-4" />,
      action: () => setRightPanelActiveTab('chat'),
    },
    {
      id: 'open-terminal',
      name: 'Toggle Terminal',
      description: 'Show or hide the terminal panel (Ctrl+`)',
      icon: <Terminal className="w-4 h-4" />,
      action: toggleV2BottomPanel,
    },
    {
      id: 'open-git',
      name: 'Open Git',
      description: 'Open the Git panel',
      icon: <GitBranch className="w-4 h-4" />,
      action: () => setV2LeftSidebarActiveTab('git'),
    },
    {
      id: 'open-settings',
      name: 'Open Settings',
      description: 'Open settings panel (Ctrl+,)',
      icon: <Settings className="w-4 h-4" />,
      action: () => setV2LeftSidebarActiveTab('settings'),
    },
    {
      id: 'new-file',
      name: 'New File',
      description: 'Create a new file (Ctrl+N)',
      icon: <Plus className="w-4 h-4" />,
      action: () => {},
    },
    {
      id: 'run-generator',
      name: 'Run Project Generator',
      description: 'Start the professional project generator',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => setRightPanelActiveTab('professional-mode'),
    },
    {
      id: 'open-explorer',
      name: 'Open Explorer',
      description: 'Open File Explorer (Ctrl+Shift+E)',
      icon: <FileCode className="w-4 h-4" />,
      action: () => setV2LeftSidebarActiveTab('explorer'),
    },
    {
      id: 'open-search',
      name: 'Search Files',
      description: 'Search in files (Ctrl+Shift+F)',
      icon: <Search className="w-4 h-4" />,
      action: () => setV2LeftSidebarActiveTab('search'),
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearchQuery('');
        setSelectedIndex(0);
        return;
      }

      // Toggle Terminal (Ctrl+`)
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        toggleV2BottomPanel();
        return;
      }

      // Open Settings (Ctrl+,)
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setV2LeftSidebarActiveTab('settings');
        return;
      }

      // New File (Ctrl+N)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        // Add new file logic here
        return;
      }

      // Open Explorer (Ctrl+Shift+E)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'e') {
        e.preventDefault();
        setV2LeftSidebarActiveTab('explorer');
        return;
      }

      // Open Search (Ctrl+Shift+F)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        setV2LeftSidebarActiveTab('search');
        return;
      }

      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, filteredCommands.length - 1)
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const command = filteredCommands[selectedIndex];
          if (command) {
            command.action();
            setIsOpen(false);
          }
        } else if (e.key === 'Escape') {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchQuery, selectedIndex, filteredCommands, setRightPanelActiveTab, toggleV2BottomPanel, setV2LeftSidebarActiveTab]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative w-full max-w-2xl bg-bg-elevated-1 rounded-xl border border-border-default shadow-2xl overflow-hidden animate-slide-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default">
          <Search className="w-5 h-5 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted focus:outline-none text-sm"
          />
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-text-muted text-sm">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors',
                  index === selectedIndex
                    ? 'bg-accent-primary/20 text-text-primary'
                    : 'text-text-secondary hover:bg-bg-elevated-2'
                )}
              >
                <div className="text-text-muted">{cmd.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{cmd.name}</div>
                  <div className="text-xs text-text-muted">{cmd.description}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}