'use client';

import React from 'react';
import { Search, Bell, User, Workflow } from 'lucide-react';

export const TopBarV2 = () => {
  return (
    <div className="h-12 flex items-center justify-between px-4 bg-bg-elevated-1 border-b border-border-default">
      {/* Left: Project Name & Workspace Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-black to-red-900 flex items-center justify-center text-white font-bold border border-red-800/30">
            S
          </div>
          <span className="text-sm font-semibold text-text-primary">SAM AI</span>
        </div>
        
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg-elevated-2 hover:bg-bg-elevated-1/50 border border-border-default text-xs text-text-secondary">
          <Workflow className="w-3.5 h-3.5" />
          <span>samai-project</span>
        </button>
      </div>
      
      {/* Center: Search Everywhere */}
      <div className="flex-1 max-w-xl mx-8">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-bg-elevated-2 border border-border-default hover:border-accent-primary/30 text-sm text-text-muted">
          <Search className="w-4 h-4" />
          <span>Search everything... (Ctrl+Shift+P)</span>
          <div className="ml-auto flex items-center gap-1 text-xs text-text-muted/70">
            <span className="px-1.5 py-0.5 rounded bg-bg-elevated-1 border border-border-default">Ctrl</span>
            <span className="px-1.5 py-0.5 rounded bg-bg-elevated-1 border border-border-default">Shift</span>
            <span className="px-1.5 py-0.5 rounded bg-bg-elevated-1 border border-border-default">P</span>
          </div>
        </button>
      </div>
      
      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-bg-elevated-2 text-text-muted hover:text-text-primary">
          <Bell className="w-5 h-5" />
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg-elevated-2 hover:bg-bg-elevated-1/50 border border-border-default">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-xs font-semibold">
            U
          </div>
        </button>
      </div>
    </div>
  );
};
