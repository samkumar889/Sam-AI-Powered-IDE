'use client';

import { useAppStore, type FileNode } from '@/store/useAppStore';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFileIcon } from '@/lib/fileIcons';

export function FileTabs() {
  const { openFiles, activeFile, setActiveFile, closeFile } = useAppStore();

  return (
    <div className="flex h-10 items-center bg-[#1e293b] border-b border-gray-700 overflow-x-auto">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={cn(
            "flex items-center gap-2 px-4 h-full border-r border-gray-700 cursor-pointer transition-colors",
            activeFile?.id === file.id ? "bg-[#0f172a] text-gray-100 border-t-2 border-t-purple-500" : "bg-[#1e293b] text-gray-400 hover:bg-[#0f172a]"
          )}
          onClick={() => setActiveFile(file)}
        >
          {getFileIcon(file.name)}
          <span className="text-sm">{file.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file.id);
            }}
            className="ml-2 hover:bg-gray-700 rounded p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
