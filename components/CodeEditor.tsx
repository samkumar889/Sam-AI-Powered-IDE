'use client';

import { Editor } from '@monaco-editor/react';
import { useAppStore } from '@/store/useAppStore';
import { FileTabs } from './layout/FileTabs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Save } from 'lucide-react';
import { getLanguageFromExtension } from '@/lib/fileTypes';

export function CodeEditor() {
  const { activeFile, updateFileContent, projectMemory, saveFileToDisk, folderHandle } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log('[CodeEditor] Rendering with activeFile:', activeFile);

  const getLanguage = getLanguageFromExtension;

  const handleChange = useCallback((value: string | undefined) => {
    if (!value || !activeFile) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (projectMemory.preferences.autoSave) {
      autoSaveTimeoutRef.current = setTimeout(async () => {
        updateFileContent(activeFile.id, value);
        if (folderHandle && activeFile.handle) {
          await saveFileToDisk(activeFile.id);
        }
      }, 1000);
    } else {
      updateFileContent(activeFile.id, value);
      if (folderHandle && activeFile.handle) {
        saveFileToDisk(activeFile.id);
      }
    }
  }, [activeFile, updateFileContent, projectMemory.preferences.autoSave, saveFileToDisk, folderHandle]);

  const handleMount = useCallback((editor: any) => {
    console.log('[CodeEditor] Monaco mounted!', editor);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Automatically hide loading state after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeFile?.id]);

  const handleManualSave = async () => {
    if (!activeFile) return;
    if (folderHandle && activeFile.handle) {
      await saveFileToDisk(activeFile.id);
    }
  };

  return (
    <div className="flex flex-col bg-[#1e1e1e] h-full">
      <div className="flex items-center justify-between bg-[#1e293b] border-b border-gray-700">
        <FileTabs />
        <div className="flex items-center gap-2 px-4">
          <button
            onClick={handleManualSave}
            disabled={!activeFile || !folderHandle}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>
      <div className="flex-1 relative min-h-0">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
            <div className="text-gray-400">Loading editor...</div>
          </div>
        )}
        {activeFile ? (
          <Editor
            height="100%"
            width="100%"
            language={getLanguage(activeFile.name)}
            value={activeFile.content}
            theme="vs-dark"
            onChange={handleChange}
            onMount={handleMount}
            options={{
              minimap: { enabled: true },
              fontSize: projectMemory.preferences?.fontSize || 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              tabSize: 2,
              insertSpaces: true,
              folding: true,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">No file selected</p>
              <p className="text-sm text-gray-500">Select a file from the explorer to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
