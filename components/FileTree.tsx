'use client';

import { useState } from 'react';
import { useAppStore, type FileNode } from '@/store/useAppStore';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFileIcon } from '@/lib/fileIcons';

interface FileTreeItemProps {
  node: FileNode;
  level: number;
}

function FileTreeItem({ node, level }: FileTreeItemProps) {
  const {
    activeFile,
    setActiveFile,
    toggleFolder,
    createFile,
    deleteFile,
    renameFile,
    loadFileContent,
    createFileOnDisk,
    deleteFileFromDisk,
    renameFileOnDisk,
    folderHandle,
    openFiles,
    setV2EditorTabs,
    setV2ActiveEditorTab,
  } = useAppStore();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [isCreating, setIsCreating] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [showActions, setShowActions] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      toggleFolder(node.id);
    }
  };

  const handleSelect = async () => {
    if (node.type === 'file') {
      if (folderHandle && node.handle && !node.content) {
        await loadFileContent(node.id);
      } else {
        // Add to openFiles if not already there
        const existing = openFiles.find(f => f.id === node.id);
        if (!existing) {
          const newOpenFiles = [...openFiles, node];
          // Update both openFiles and v2EditorTabs
          useAppStore.setState({ 
            openFiles: newOpenFiles, 
            v2EditorTabs: newOpenFiles 
          });
        }
        setActiveFile(node);
        setV2ActiveEditorTab(node.id);
        setV2EditorTabs(openFiles);
      }
    }
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      if (folderHandle) {
        await renameFileOnDisk(node.id, newName.trim());
      } else {
        renameFile(node.id, newName.trim());
      }
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setNewName(node.name);
    setIsRenaming(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (folderHandle) {
      await deleteFileFromDisk(node.id);
    } else {
      deleteFile(node.id);
    }
  };

  const handleCreateFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreateType('file');
    setCreateName('');
    setIsCreating(true);
  };

  const handleCreateFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreateType('folder');
    setCreateName('');
    setIsCreating(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createName.trim()) {
      if (folderHandle) {
        await createFileOnDisk(node.id, createName.trim(), createType);
      } else if (node.type === 'folder') {
        createFile(node.id, createName.trim(), createType);
      } else {
        createFile(null, createName.trim(), createType);
      }
    }
    setIsCreating(false);
  };

  const handleCreateCancel = () => {
    setIsCreating(false);
    setCreateName('');
  };

  const getIcon = () => {
    if (node.type === 'folder') {
      return node.isExpanded ? (
        <FolderOpen className="h-4 w-4 text-yellow-400" />
      ) : (
        <Folder className="h-4 w-4 text-yellow-400" />
      );
    }
    return getFileIcon(node.name);
  };

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1 text-sm cursor-pointer transition-colors select-none',
          activeFile?.id === node.id
            ? 'bg-accent-primary/20 text-text-primary border-l-2 border-accent-primary'
            : 'text-text-secondary hover:bg-bg-elevated-1'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleSelect}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {node.type === 'folder' && (
          <button
            onClick={handleToggle}
            className="p-0.5 hover:bg-gray-600 rounded text-gray-400"
          >
            {node.isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        {node.type === 'file' && <div className="w-4" />}

        {isRenaming ? (
          <form onSubmit={handleRenameSubmit} className="flex-1 flex items-center gap-1">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 bg-bg-elevated-1 border border-border-default rounded px-1.5 py-0.5 text-sm text-text-primary focus:outline-none focus:border-border-focus"
              onBlur={handleRenameCancel}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleRenameCancel();
              }}
            />
            <button type="submit" className="p-0.5 hover:bg-gray-600 rounded">
              <Check className="h-3.5 w-3.5 text-green-400" />
            </button>
            <button
              type="button"
              onClick={handleRenameCancel}
              className="p-0.5 hover:bg-gray-600 rounded"
            >
              <X className="h-3.5 w-3.5 text-red-400" />
            </button>
          </form>
        ) : (
          <>
            {getIcon()}
            <span className="flex-1 truncate">{node.name}</span>
            {showActions && !isRenaming && (
              <div className="flex items-center gap-0.5">
                {node.type === 'folder' && (
                  <>
                    <button
                      onClick={handleCreateFile}
                      className="p-0.5 hover:bg-gray-600 rounded text-gray-400"
                      title="New File"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={handleCreateFolder}
                      className="p-0.5 hover:bg-gray-600 rounded text-gray-400"
                      title="New Folder"
                    >
                      <Folder className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
                <button
                  onClick={handleRename}
                  className="p-0.5 hover:bg-gray-600 rounded text-gray-400"
                  title="Rename"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-0.5 hover:bg-gray-600 rounded text-gray-400"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isCreating && (
        <div
          className="flex items-center gap-1 px-2 py-1 text-sm"
          style={{ paddingLeft: `${(level + 1) * 12 + 20}px` }}
        >
          {createType === 'file' ? (
            <FileText className="h-4 w-4 text-blue-300" />
          ) : (
            <Folder className="h-4 w-4 text-yellow-400" />
          )}
          <form onSubmit={handleCreateSubmit} className="flex-1 flex items-center gap-1">
            <input
              autoFocus
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder={createType === 'file' ? 'newfile.js' : 'newfolder'}
              className="flex-1 bg-bg-elevated-1 border border-border-default rounded px-1.5 py-0.5 text-sm text-text-primary focus:outline-none focus:border-border-focus"
              onBlur={handleCreateCancel}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleCreateCancel();
              }}
            />
          </form>
        </div>
      )}

      {node.type === 'folder' && node.isExpanded && node.children?.map((child) => (
        <FileTreeItem key={child.id} node={child} level={level + 1} />
      ))}
    </div>
  );
}

export function FileTree() {
  const { fileTree, createFile, createFileOnDisk, folderHandle } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createName.trim()) {
      if (folderHandle && fileTree[0]?.id) {
        await createFileOnDisk(fileTree[0].id, createName.trim(), createType);
      } else {
        createFile(fileTree[0]?.id || null, createName.trim(), createType);
      }
    }
    setIsCreating(false);
    setCreateName('');
  };

  const handleCreateCancel = () => {
    setIsCreating(false);
    setCreateName('');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {fileTree.map((node) => (
        <FileTreeItem key={node.id} node={node} level={0} />
      ))}

      {isCreating && (
        <div className="flex items-center gap-1 px-2 py-1 text-sm" style={{ paddingLeft: '8px' }}>
          {createType === 'file' ? (
            <FileText className="h-4 w-4 text-blue-300" />
          ) : (
            <Folder className="h-4 w-4 text-yellow-400" />
          )}
          <form onSubmit={handleCreateSubmit} className="flex-1 flex items-center gap-1">
            <input
              autoFocus
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder={createType === 'file' ? 'newfile.js' : 'newfolder'}
              className="flex-1 bg-bg-elevated-1 border border-border-default rounded px-1.5 py-0.5 text-sm text-text-primary focus:outline-none focus:border-border-focus"
              onBlur={handleCreateCancel}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleCreateCancel();
              }}
            />
          </form>
        </div>
      )}

      {!isCreating && (
        <div
          className="flex items-center gap-1 px-2 py-1 text-sm text-gray-400 hover:bg-gray-700 cursor-pointer"
          style={{ paddingLeft: '8px' }}
        >
          <button
            onClick={() => {
              setCreateType('file');
              setCreateName('');
              setIsCreating(true);
            }}
            className="flex items-center gap-1 w-full hover:text-gray-100"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="text-xs">New File</span>
          </button>
          <button
            onClick={() => {
              setCreateType('folder');
              setCreateName('');
              setIsCreating(true);
            }}
            className="flex items-center gap-1 hover:text-gray-100"
          >
            <Folder className="h-3.5 w-3.5" />
            <span className="text-xs">New Folder</span>
          </button>
        </div>
      )}
    </div>
  );
}
