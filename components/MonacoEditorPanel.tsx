'use client';

import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Copy, 
  Download, 
  Settings as SettingsIcon,
  Maximize2,
  Minimize2,
  FileCode
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface MonacoEditorPanelProps {
  file: {
    name: string;
    content: string;
    language: string;
  };
  fileId?: string;
}

export default function MonacoEditorPanel({ file, fileId }: MonacoEditorPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const editorRef = useRef<any>(null);
  const { updateFileContent, saveFileToDisk, activeFile } = useAppStore();

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Set custom theme
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 16, bottom: 16 },
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
    });
  };

  const handleCopy = () => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      navigator.clipboard.writeText(content);
    }
  };

  const handleDownload = () => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleSave = async () => {
    if (editorRef.current && fileId) {
      const content = editorRef.current.getValue();
      updateFileContent(fileId, content);
      await saveFileToDisk(fileId);
    }
  };

  // Also add document-level Ctrl+S handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className={cn(
      "flex flex-col h-full bg-bg-elevated-2",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-elevated-1 border-b border-border-default">
        <div className="flex items-center gap-2">
          <FileCode size={16} className="text-accent-primary" />
          <span className="text-sm text-text-primary font-medium">{file.name}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated-2 rounded transition-colors"
            title="Copy"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated-2 rounded transition-colors"
            title="Download"
          >
            <Download size={14} />
          </button>
          <button
            onClick={handleSave}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated-2 rounded transition-colors"
            title="Save (Ctrl+S)"
          >
            <Save size={14} />
          </button>
          <div className="w-px h-4 bg-border-default mx-1" />
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated-2 rounded transition-colors"
            title="Settings"
          >
            <SettingsIcon size={14} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-elevated-2 rounded transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 py-2 bg-bg-elevated-1 border-b border-border-default"
        >
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 text-text-secondary">
              <input type="checkbox" defaultChecked className="accent-accent-primary" />
              Word Wrap
            </label>
            <label className="flex items-center gap-2 text-text-secondary">
              <input type="checkbox" defaultChecked className="accent-accent-primary" />
              Minimap
            </label>
            <label className="flex items-center gap-2 text-text-secondary">
              <input type="checkbox" defaultChecked className="accent-accent-primary" />
              Line Numbers
            </label>
          </div>
        </motion.div>
      )}

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage={file.language}
          value={file.content}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={(value) => {
            if (value && fileId) {
              updateFileContent(fileId, value);
            }
          }}
          options={{
            theme: 'vs-dark',
            fontSize: 14,
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-bg-elevated-1 border-t border-border-default text-xs text-text-muted">
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{file.language}</span>
          <span>{file.content.split('\n').length} lines</span>
        </div>
      </div>
    </div>
  );
}
