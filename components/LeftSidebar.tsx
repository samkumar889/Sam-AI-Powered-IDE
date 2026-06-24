'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Clock, 
  MessageSquare, 
  FolderKanban,
  ChevronDown,
  ChevronRight,
  X,
  Sparkles,
  Folder,
  GitBranch,
  Settings,
  FileCode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { FileTree } from './FileTree';
import GitPanel from './GitPanel';
import { SettingsPanel } from './SettingsPanel';

// Component to safely render relative time without hydration errors
function SafeTimeAgo({ date }: { date: Date }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="text-xs text-text-muted">...</span>;
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let text;
  if (days > 0) {
    text = `${days}d ago`;
  } else if (hours > 0) {
    text = `${hours}h ago`;
  } else if (minutes > 0) {
    text = `${minutes}m ago`;
  } else {
    text = 'just now';
  }

  return <span className="text-xs text-text-muted mt-0.5">{text}</span>;
}

interface Session {
  id: string;
  title: string;
  lastModified: Date;
  messages: number;
}

interface Space {
  id: string;
  name: string;
  projects: number;
}

interface LeftSidebarProps {
  isCollapsed: boolean;
  activeView: 'chat' | 'files' | 'search' | 'git' | 'settings';
}

function ChatView() {
  const [sessionsExpanded, setSessionsExpanded] = useState(true);
  const [spacesExpanded, setSpacesExpanded] = useState(true);
  const [recentExpanded, setRecentExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sessions: Session[] = [
    { id: '1', title: 'Build React Dashboard', lastModified: new Date(), messages: 24 },
    { id: '2', title: 'Debug API Integration', lastModified: new Date(Date.now() - 3600000), messages: 18 },
    { id: '3', title: 'Code Review Session', lastModified: new Date(Date.now() - 7200000), messages: 12 },
  ];

  const spaces: Space[] = [
    { id: '1', name: 'Personal Projects', projects: 5 },
    { id: '2', name: 'Work Projects', projects: 3 },
    { id: '3', name: 'Learning', projects: 8 },
  ];

  const recentChats = [
    { id: '1', title: 'TypeScript generics help', time: '2h ago' },
    { id: '2', title: 'React hooks optimization', time: '5h ago' },
    { id: '3', title: 'Docker setup guide', time: '1d ago' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-2">
      {/* New Session Button */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-medium">
          <Plus size={18} />
          New Session
        </button>
      </div>

      {/* Sessions Section */}
      <div className="mb-4">
        <button
          onClick={() => setSessionsExpanded(!sessionsExpanded)}
          className="w-full flex items-center justify-between px-2 py-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span className="text-sm font-medium">Sessions</span>
          </div>
          {sessionsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        
        <AnimatePresence>
          {sessionsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {sessions.map((session) => (
                  <motion.button
                    key={session.id}
                    whileHover={{ backgroundColor: '#161b22' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-start gap-2 px-3 py-2 rounded-lg text-left group"
                  >
                    <MessageSquare size={14} className="text-text-muted mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{session.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {session.messages} messages
                      </p>
                    </div>
                    <X 
                      size={12} 
                      className="text-text-muted opacity-0 group-hover:opacity-100 hover:text-text-primary transition-all flex-shrink-0"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spaces Section */}
      <div className="mb-4">
        <button
          onClick={() => setSpacesExpanded(!spacesExpanded)}
          className="w-full flex items-center justify-between px-2 py-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            <FolderKanban size={16} />
            <span className="text-sm font-medium">Spaces</span>
          </div>
          {spacesExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        
        <AnimatePresence>
          {spacesExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {spaces.map((space) => (
                  <motion.button
                    key={space.id}
                    whileHover={{ backgroundColor: '#161b22' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left"
                  >
                    <FolderKanban size={14} className="text-text-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{space.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {space.projects} projects
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Chats Section */}
      <div className="mb-4">
        <button
          onClick={() => setRecentExpanded(!recentExpanded)}
          className="w-full flex items-center justify-between px-2 py-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="text-sm font-medium">Recent</span>
          </div>
          {recentExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        
        <AnimatePresence>
          {recentExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {recentChats.map((chat) => (
                  <motion.button
                    key={chat.id}
                    whileHover={{ backgroundColor: '#161b22' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left"
                  >
                    <MessageSquare size={14} className="text-text-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{chat.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{chat.time}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FilesView() {
  const { openFolder } = useAppStore();
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border">
        <button 
          onClick={openFolder}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-medium"
        >
          <Folder size={18} />
          Open Folder
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <FileTree />
      </div>
    </div>
  );
}

function SearchView() {
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    searchCodebase, 
    isSearching, 
    indexCodebase, 
    isIndexing, 
    indexStatus 
  } = useAppStore();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchCodebase(searchQuery);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Indexing Controls */}
      <div className="p-4 border-b border-border space-y-3">
        <button
          onClick={indexCodebase}
          disabled={isIndexing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
        >
          <FileCode size={16} />
          {isIndexing ? 'Indexing...' : 'Index Codebase'}
        </button>
        
        {isIndexing && (
          <div className="text-xs text-text-muted">
            {indexStatus}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-border">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Semantic search codebase..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent transition-colors"
          />
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {isSearching ? (
          <div className="text-center text-text-muted text-sm mt-8">
            <Search className="mx-auto mb-2 opacity-50 animate-pulse" size={32} />
            <p>Searching...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-3">
            {searchResults.map((result) => (
              <div key={result.id} className="p-3 bg-panel border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileCode size={14} className="text-accent" />
                  <span className="text-xs font-medium text-text-primary truncate">
                    {result.metadata.name}
                  </span>
                </div>
                <p className="text-xs text-text-secondary line-clamp-4">
                  {result.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-text-muted text-sm mt-8">
            <Search className="mx-auto mb-2 opacity-50" size={32} />
            <p>Index codebase first, then search!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeftSidebar({ isCollapsed, activeView }: LeftSidebarProps) {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-[280px] bg-sidebar border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-accent" size={20} />
          <h2 className="text-lg font-semibold text-text-primary">SAM AI</h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-panel border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* View Content */}
      {activeView === 'chat' && <ChatView />}
      {activeView === 'files' && <FilesView />}
      {activeView === 'search' && <SearchView />}
      {activeView === 'git' && <GitPanel />}
      {activeView === 'settings' && <SettingsPanel />}

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary truncate">User</p>
            <p className="text-xs text-text-muted">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
