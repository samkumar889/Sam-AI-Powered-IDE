'use client';

import { Search, Database, RefreshCw, FileCode, Copy, Check, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  path: string;
  content: string;
  startLine: number;
  endLine: number;
  relevance: number;
}

export const SearchPanel = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'files' | 'content'>('all');

  const handleIndex = async () => {
    setIsIndexing(true);
    setStatus('Indexing codebase...');
    // Simulate indexing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus(`Successfully indexed 24 files!`);
    setIsIndexing(false);
    setTimeout(() => setStatus(''), 5000);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResults: SearchResult[] = [
      {
        id: '1',
        path: 'components/ActivityBar.tsx',
        content: 'export default function ActivityBar() {\n  return (\n    <div className="flex flex-col items-center py-3 bg-bg-elevated-1">\n      {/* Activity icons */}\n    </div>\n  );\n}',
        startLine: 10,
        endLine: 15,
        relevance: 0.95,
      },
      {
        id: '2',
        path: 'components/LeftSidebar.tsx',
        content: 'export default function LeftSidebar() {\n  const [sessionsExpanded, setSessionsExpanded] = useState(true);\n  return (\n    <div className="w-[280px] bg-bg-elevated-1">\n      {/* Sidebar content */}\n    </div>\n  );\n}',
        startLine: 5,
        endLine: 10,
        relevance: 0.87,
      },
    ];
    
    setResults(mockResults);
    setIsSearching(false);
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-bg-elevated-2 border-r border-border-default">
      {/* Header */}
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Search className="w-4 h-4 text-accent-primary" />
            Search
          </h2>
          <button
            onClick={handleIndex}
            disabled={isIndexing}
            className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary hover:bg-accent-primary-hover disabled:opacity-50 rounded text-sm transition-colors text-white"
          >
            {isIndexing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            {isIndexing ? 'Indexing...' : 'Index'}
          </button>
        </div>

        {/* Status */}
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "text-sm mb-3",
                status.includes('Successfully') ? "text-green-400" : "text-red-400"
              )}
            >
              {status}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search form */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search codebase..."
              className="w-full pl-10 pr-10 py-2 bg-bg-elevated-1 border border-border-default rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary outline-none transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs transition-colors",
                filterType === 'all' ? "bg-accent-primary/20 text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated-1"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('files')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs transition-colors",
                filterType === 'files' ? "bg-accent-primary/20 text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated-1"
              )}
            >
              Files
            </button>
            <button
              type="button"
              onClick={() => setFilterType('content')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs transition-colors",
                filterType === 'content' ? "bg-accent-primary/20 text-text-primary" : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated-1"
              )}
            >
              Content
            </button>
          </div>

          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary-hover disabled:opacity-50 rounded-lg text-sm text-white transition-colors"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {isSearching ? (
          <div className="flex items-center justify-center h-full text-text-muted">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Searching...
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <FileCode className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No results yet. Try searching or index your codebase first!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-text-muted mb-2">
              Found {results.length} results
            </div>
            {results.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-elevated-1 border border-border-default rounded-lg p-3 hover:border-accent-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileCode className="w-4 h-4 text-accent-primary" />
                    <span className="font-mono text-text-primary">{result.path}</span>
                    <span className="text-xs text-text-muted">
                      Lines {result.startLine}-{result.endLine}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">{Math.round(result.relevance * 100)}% match</span>
                    <button
                      onClick={() => handleCopy(result.content, result.id)}
                      className="text-text-muted hover:text-text-primary transition flex items-center gap-1"
                    >
                      {copiedId === result.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <pre className="bg-bg-elevated-3 p-3 rounded text-xs font-mono text-text-secondary overflow-x-auto max-h-40 overflow-y-auto">
                  {result.content}
                </pre>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
