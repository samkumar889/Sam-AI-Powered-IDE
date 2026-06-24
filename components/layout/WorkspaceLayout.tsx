'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from '@/components/Sidebar';
import { RightPanel } from './RightPanel';
import { LivePreviewSystem } from '@/components/LivePreviewSystem';
import { BottomPanel } from '@/components/BottomPanel';
import { useAppStore } from '@/store/useAppStore';

export const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  const { previewVisible } = useAppStore();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0f172a] text-gray-200">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
          <BottomPanel />
        </div>
        {/* Live Preview & Hosting System */}
        {previewVisible && (
          <div className="w-[55%] flex-shrink-0 border-l border-gray-700">
            <LivePreviewSystem />
          </div>
        )}
        {/* Right Panel (Agent) */}
        <RightPanel />
      </div>
    </div>
  );
};
