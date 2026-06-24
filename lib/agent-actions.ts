import { FileNode } from '@/store/useAppStore';

// Find a file node by path
export function findFileByPath(nodes: FileNode[], path: string): FileNode | null {
  for (const node of nodes) {
    if (node.path === path && node.type === 'file') {
      return node;
    }
    if (node.children) {
      const found = findFileByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
}

// Find a directory node by path
export function findDirectoryByPath(nodes: FileNode[], path: string): FileNode | null {
  for (const node of nodes) {
    if (node.path === path && node.type === 'folder') {
      return node;
    }
    if (node.children) {
      const found = findDirectoryByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
}

// Generate a new file node
export function createFileNode(
  parent: FileNode, 
  name: string, 
  content?: string
): FileNode {
  return {
    id: Math.random().toString(36).slice(2, 11),
    name,
    type: 'file',
    content: content || '',
    path: `${parent.path}/${name}`
  };
}

// Update file content
export function updateFileContent(
  nodes: FileNode[], 
  path: string, 
  content: string
): FileNode[] {
  return nodes.map((node) => {
    if (node.path === path && node.type === 'file') {
      return { ...node, content };
    }
    if (node.children) {
      return {
        ...node,
        children: updateFileContent(node.children, path, content)
      };
    }
    return node;
  });
}

// Add a new file to the tree
export function addFileToTree(
  nodes: FileNode[],
  parentPath: string,
  file: FileNode
): FileNode[] {
  return nodes.map((node) => {
    if (node.path === parentPath && node.type === 'folder') {
      return {
        ...node,
        children: [...(node.children || []), file]
      };
    }
    if (node.children) {
      return {
        ...node,
        children: addFileToTree(node.children, parentPath, file)
      };
    }
    return node;
  });
}

// Delete a file from the tree
export function deleteFileFromTree(
  nodes: FileNode[],
  path: string
): FileNode[] {
  return nodes.filter((node) => {
    if (node.path === path) return false;
    if (node.children) {
      return true;
    }
    return true;
  }).map((node) => {
    if (node.children) {
      return {
        ...node,
        children: deleteFileFromTree(node.children, path)
      };
    }
    return node;
  });
}