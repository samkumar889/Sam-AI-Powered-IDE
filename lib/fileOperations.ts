
import { useAppStore, type FileNode } from '@/store/useAppStore';

// Structured result types
export interface FileOperationResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface FileReadResult extends FileOperationResult {
  data?: {
    path: string;
    content: string;
  };
}

export interface FileWriteResult extends FileOperationResult {
  data?: {
    path: string;
    content: string;
  };
}

export interface FileUpdateResult extends FileOperationResult {
  data?: {
    path: string;
    oldContent: string;
    newContent: string;
  };
}

export interface FileCreateResult extends FileOperationResult {
  data?: {
    path: string;
    type: 'file' | 'folder';
    content?: string;
  };
}

export interface FileDeleteResult extends FileOperationResult {
  data?: {
    path: string;
  };
}

export interface FileRenameResult extends FileOperationResult {
  data?: {
    oldPath: string;
    newPath: string;
  };
}

// Helper function to find file node by path
const findFileByPath = (nodes: FileNode[], path: string): FileNode | null => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findFileByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to find parent folder
const findParentFolder = (nodes: FileNode[], childPath: string): FileNode | null => {
  const pathParts = childPath.split('/').filter(Boolean);
  if (pathParts.length <= 1) return null;
  const parentPath = pathParts.slice(0, -1).join('/');
  return findFileByPath(nodes, parentPath);
};

export const fileOperations = {
  /**
   * Read a file by its path
   */
  readFile: async (path: string): Promise<FileReadResult> => {
    const store = useAppStore.getState();
    const file = findFileByPath(store.fileTree, path);
    
    if (!file) {
      return {
        success: false,
        message: `File not found: ${path}`,
        error: 'FILE_NOT_FOUND'
      };
    }
    
    if (file.type === 'folder') {
      return {
        success: false,
        message: `Cannot read folder as file: ${path}`,
        error: 'IS_FOLDER'
      };
    }
    
    // If we have a real file handle, use it
    if (store.folderHandle && file.handle) {
      try {
        const fileObj = await (file.handle as FileSystemFileHandle).getFile();
        const content = await fileObj.text();
        // Update store with latest content
        store.updateFileContent(file.id, content);
        return {
          success: true,
          message: 'File read successfully from disk',
          data: {
            path,
            content
          }
        };
      } catch (err) {
        console.error('Failed to read file from disk:', err);
      }
    }
    
    return {
      success: true,
      message: 'File read successfully',
      data: {
        path,
        content: file.content || ''
      }
    };
  },

  /**
   * Write content to a file (creates or overwrites)
   */
  writeFile: async (path: string, content: string): Promise<FileWriteResult> => {
    const store = useAppStore.getState();
    const existingFile = findFileByPath(store.fileTree, path);
    
    if (existingFile && existingFile.type === 'folder') {
      return {
        success: false,
        message: `Path is a folder: ${path}`,
        error: 'PATH_IS_FOLDER'
      };
    }
    
    if (existingFile) {
      // Update existing file
      store.updateFileContent(existingFile.id, content);
      // If we have a real file handle, write to disk
      if (store.folderHandle && existingFile.handle) {
        try {
          const writable = await (existingFile.handle as FileSystemFileHandle).createWritable();
          await writable.write(content);
          await writable.close();
        } catch (err) {
          console.error('Failed to write file to disk:', err);
        }
      }
      return {
        success: true,
        message: `File updated successfully: ${path}`,
        data: { path, content }
      };
    } else {
      // Create new file
      const pathParts = path.split('/').filter(Boolean);
      const fileName = pathParts.pop() || path;
      const parentPath = pathParts.join('/');
      let parent = findFileByPath(store.fileTree, parentPath);
      
      if (!parent && pathParts.length > 0) {
        return {
          success: false,
          message: `Parent folder not found: ${parentPath}`,
          error: 'PARENT_FOLDER_NOT_FOUND'
        };
      }
      
      const parentId = parent?.id || store.fileTree[0]?.id;
      
      // If we have a real folder handle, create on disk first
      if (store.folderHandle && parent?.handle) {
        try {
          await store.createFileOnDisk(parentId, fileName, 'file', content);
        } catch (err) {
          console.error('Failed to create file on disk:', err);
        }
      } else {
        store.createFile(parentId || null, fileName, 'file', content);
      }
      
      return {
        success: true,
        message: `File created successfully: ${path}`,
        data: { path, content }
      };
    }
  },

  /**
   * Update file content with optional diff strategy
   */
  updateFile: async (
    path: string,
    newContent: string,
    mode: 'overwrite' | 'append' | 'prepend' = 'overwrite'
  ): Promise<FileUpdateResult> => {
    const store = useAppStore.getState();
    const file = findFileByPath(store.fileTree, path);
    
    if (!file) {
      return {
        success: false,
        message: `File not found: ${path}`,
        error: 'FILE_NOT_FOUND'
      };
    }
    
    if (file.type === 'folder') {
      return {
        success: false,
        message: `Cannot update folder: ${path}`,
        error: 'IS_FOLDER'
      };
    }
    
    const oldContent = file.content || '';
    let finalContent = newContent;
    
    switch (mode) {
      case 'append':
        finalContent = oldContent + newContent;
        break;
      case 'prepend':
        finalContent = newContent + oldContent;
        break;
      default:
        finalContent = newContent;
    }
    
    store.updateFileContent(file.id, finalContent);
    
    // If we have a real file handle, write to disk
    if (store.folderHandle && file.handle) {
      try {
        const writable = await (file.handle as FileSystemFileHandle).createWritable();
        await writable.write(finalContent);
        await writable.close();
      } catch (err) {
        console.error('Failed to write file to disk:', err);
      }
    }
    
    return {
      success: true,
      message: `File updated successfully: ${path}`,
      data: { path, oldContent, newContent: finalContent }
    };
  },

  /**
   * Create a new file or folder
   */
  createFile: async (
    path: string,
    type: 'file' | 'folder' = 'file',
    content: string = ''
  ): Promise<FileCreateResult> => {
    const store = useAppStore.getState();
    const existingFile = findFileByPath(store.fileTree, path);
    
    if (existingFile) {
      return {
        success: false,
        message: `Path already exists: ${path}`,
        error: 'PATH_EXISTS'
      };
    }
    
    const pathParts = path.split('/').filter(Boolean);
    const name = pathParts.pop() || path;
    const parentPath = pathParts.join('/');
    let parent = findFileByPath(store.fileTree, parentPath);
    
    if (!parent && pathParts.length > 0) {
      return {
        success: false,
        message: `Parent folder not found: ${parentPath}`,
        error: 'PARENT_FOLDER_NOT_FOUND'
      };
    }
    
    const parentId = parent?.id || store.fileTree[0]?.id;
    
    // If we have a real folder handle, create on disk first
    if (store.folderHandle && parent?.handle) {
      try {
        await store.createFileOnDisk(parentId, name, type, content);
      } catch (err) {
        console.error('Failed to create file/folder on disk:', err);
      }
    } else {
      store.createFile(parentId || null, name, type, content);
    }
    
    return {
      success: true,
      message: `${type === 'folder' ? 'Folder' : 'File'} created successfully: ${path}`,
      data: {
        path,
        type,
        content: type === 'file' ? content : undefined
      }
    };
  },

  /**
   * Delete a file or folder
   */
  deleteFile: async (path: string): Promise<FileDeleteResult> => {
    const store = useAppStore.getState();
    const file = findFileByPath(store.fileTree, path);
    
    if (!file) {
      return {
        success: false,
        message: `File/folder not found: ${path}`,
        error: 'NOT_FOUND'
      };
    }
    
    // If we have real handles, delete from disk first
    if (store.folderHandle) {
      try {
        await store.deleteFileFromDisk(file.id);
      } catch (err) {
        console.error('Failed to delete file/folder from disk:', err);
      }
    } else {
      store.deleteFile(file.id);
    }
    
    return {
      success: true,
      message: `Deleted successfully: ${path}`,
      data: { path }
    };
  },

  /**
   * Rename a file or folder
   */
  renameFile: async (oldPath: string, newName: string): Promise<FileRenameResult> => {
    const store = useAppStore.getState();
    const file = findFileByPath(store.fileTree, oldPath);
    
    if (!file) {
      return {
        success: false,
        message: `File/folder not found: ${oldPath}`,
        error: 'NOT_FOUND'
      };
    }
    
    // Build new path
    const pathParts = oldPath.split('/').filter(Boolean);
    pathParts.pop();
    pathParts.push(newName);
    const newPath = pathParts.join('/');
    
    // If we have real handles, rename on disk first
    if (store.folderHandle) {
      try {
        await store.renameFileOnDisk(file.id, newName);
      } catch (err) {
        console.error('Failed to rename file/folder on disk:', err);
      }
    } else {
      store.renameFile(file.id, newName);
    }
    
    return {
      success: true,
      message: `Renamed to: ${newPath}`,
      data: { oldPath, newPath }
    };
  }
};
