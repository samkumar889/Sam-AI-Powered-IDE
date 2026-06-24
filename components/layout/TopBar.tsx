
'use client';

import React from 'react';
import { MessageSquare, Terminal, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

export const TopBar = () => {
  const { rightPanelVisible, toggleRightPanel, bottomPanelVisible, toggleBottomPanel, previewVisible, togglePreview } = useAppStore();

  return (
    <header className="flex h-12 items-center justify-between border-b border-gray-700 bg-[#1e293b] px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-800 font-bold text-white">
          S
        </div>
        <span className="font-semibold text-sm text-gray-100">SAM AI</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={previewVisible ? "default" : "ghost"}
          size="sm"
          onClick={togglePreview}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant={bottomPanelVisible ? "default" : "ghost"}
          size="sm"
          onClick={toggleBottomPanel}
        >
          <Terminal className="h-4 w-4 mr-2" />
          Terminal
        </Button>
      </div>
    </header>
  );
};
