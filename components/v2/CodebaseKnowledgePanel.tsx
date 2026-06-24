'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Search, Database, Play, RefreshCw, FileText } from 'lucide-react';

export const CodebaseKnowledgePanel = () => {
  const {
    isIndexing,
    indexProgress,
    indexStatus,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    indexCodebase,
    searchCodebase,
  } = useAppStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchCodebase(searchQuery);
  };

  return (
    <div className="flex flex-col h-full bg-bg-elevated-2 border-r border-border-default">
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-5 h-5 text-accent-primary" />
          <h3 className="font-semibold text-text-primary">Codebase Knowledge</h3>
        </div>

        <div className="mb-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search your codebase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-bg-elevated-1 border border-border-default rounded-md focus:outline-none focus:border-accent-primary text-text-primary"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-3 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/80 disabled:opacity-50 transition-colors"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Index Status</span>
            <span className="text-xs text-text-primary">{indexStatus}</span>
          </div>

          {isIndexing && (
            <div className="w-full bg-bg-elevated-1 rounded-full h-1.5">
              <div
                className="bg-accent-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${indexProgress}%` }}
              />
            </div>
          )}

          <button
            onClick={indexCodebase}
            disabled={isIndexing}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm bg-accent-primary/10 text-accent-primary border border-accent-primary/20 rounded-md hover:bg-accent-primary/20 transition-colors disabled:opacity-50"
          >
            {isIndexing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isIndexing ? 'Indexing...' : 'Index Codebase'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {searchResults.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-text-primary mb-3">Search Results</h4>
            {searchResults.map((result) => (
              <div key={result.id} className="p-3 bg-bg-elevated-1 border border-border-default rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-accent-primary" />
                  <span className="text-sm font-medium text-text-primary">{result.metadata.name}</span>
                  <span className="text-xs text-text-muted">{result.metadata.path}</span>
                </div>
                <p className="text-xs text-text-muted line-clamp-3">{result.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Database className="w-12 h-12 text-text-muted/30 mb-3" />
            <p className="text-sm text-text-muted">No search results yet</p>
            <p className="text-xs text-text-muted/70 mt-1">Index your codebase to search through it</p>
          </div>
        )}
      </div>
    </div>
  );
};