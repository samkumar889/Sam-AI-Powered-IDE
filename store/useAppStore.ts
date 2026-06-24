import { create } from "zustand";
import { ModelId } from "@/lib/aiModels";
import { workspaceMemoryDB } from "@/lib/workspaceMemory";

declare global {
  interface Window {
    showDirectoryPicker: (options?: { mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>;
  }
  
  interface FileSystemDirectoryHandle {
    entries(): AsyncIterable<[string, any]>;
    removeEntry(name: string, options?: { recursive?: boolean }): Promise<void>;
  }
}

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
  isExpanded?: boolean;
  path: string;
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface AgentFileChange {
  path: string;
  type: "create" | "modify" | "delete";
  content?: string;
  originalContent?: string;
  status: "pending" | "in-progress" | "completed" | "failed";
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'info' | 'warning' | 'success';
  content: string;
  timestamp: number;
}

export interface TerminalSession {
  id: string;
  lines: TerminalLine[];
  currentCommand: string;
  isRunning: boolean;
  status: 'idle' | 'running' | 'error' | 'success';
}

export interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  result?: any;
}

export interface AgentAction {
  id: string;
  type: "read" | "edit" | "create" | "delete";
  path: string;
  content?: string;
  newContent?: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  timestamp: Date;
  result?: string;
}

export interface AgentWorkflow {
  id: string;
  userPrompt: string;
  status: "idle" | "analyzing" | "planning" | "executing" | "reviewing" | "fixing" | "pendingReview" | "completed" | "failed";
  steps: AgentStep[];
  actions: AgentAction[];
  pendingFileChanges: AgentFileChange[];
  currentStep?: string;
}

export interface GitFileChange {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed';
  originalContent?: string;
  newContent?: string;
}

export interface GitCommit {
  id: string;
  message: string;
  date: Date;
  author: string;
}

export interface GitBranch {
  name: string;
  isCurrent: boolean;
}

// Project Memory Types
export interface ProjectArchitectureNode {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'component' | 'function' | 'class';
  path?: string;
  children?: ProjectArchitectureNode[];
  description?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  autoSave: boolean;
  language: string;
}

export interface ProjectMemory {
  architecture: ProjectArchitectureNode[];
  preferences: UserPreferences;
  previousConversations: Message[];
  agentTaskHistory: AgentTask[];
  generatedFiles: { id: string; path: string; name: string; content?: string; createdAt: number }[];
  userDecisions: { id: string; decision: string; context?: string; createdAt: number }[];
  techStack: string[];
}

export interface AgentTask {
  id: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  steps: AgentStep[];
  currentStepIndex: number;
  fileChanges: AgentFileChange[];
  createdAt: Date;
  completedAt?: Date;
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: {
    path: string;
    name: string;
    type: 'file' | 'chunk';
    chunkIndex?: number;
    totalChunks?: number;
  };
}

interface AppState {
  fileTree: FileNode[];
  activeFile: FileNode | null;
  setActiveFile: (file: FileNode | null) => void;
  updateFileContent: (fileId: string, content: string) => void;
  openFiles: FileNode[];
  closeFile: (fileId: string) => void;
  toggleFolder: (folderId: string) => void;
  createFile: (parentId: string | null, name: string, type: "file" | "folder", content?: string) => void;
  deleteFile: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  getFileByPath: (path: string) => FileNode | null;
  folderHandle: FileSystemDirectoryHandle | null;
  setFolderHandle: (handle: FileSystemDirectoryHandle | null) => void;
  openFolder: () => Promise<void>;
  loadFolderTree: (handle: FileSystemDirectoryHandle, parentPath?: string) => Promise<FileNode[]>;
  loadFileContent: (fileId: string) => Promise<void>;
  saveFileToDisk: (fileId: string) => Promise<void>;
  createFileOnDisk: (parentId: string, name: string, type: 'file' | 'folder', content?: string) => Promise<void>;
  deleteFileFromDisk: (fileId: string) => Promise<void>;
  renameFileOnDisk: (fileId: string, newName: string) => Promise<void>;
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  agentTasks: AgentTask[];
  addAgentTask: (task: AgentTask) => void;
  updateAgentTask: (taskId: string, updates: Partial<AgentTask>) => void;
  addFileChangeToTask: (taskId: string, fileChange: AgentFileChange) => void;
  updateStepInTask: (taskId: string, stepId: string, updates: Partial<AgentStep>) => void;
  // Old layout
  sidebarActiveTab: "projects" | "files" | "search" | "git" | "memory";
  setSidebarActiveTab: (tab: "projects" | "files" | "search" | "git" | "memory") => void;
  rightPanelActiveTab: "chat" | "agent" | "search" | "file-ops" | "project-generator" | "professional-mode" | "multi-agent" | "master-builder" | "deployment" | "test-generator";
  setRightPanelActiveTab: (tab: "chat" | "agent" | "search" | "file-ops" | "project-generator" | "professional-mode" | "multi-agent" | "master-builder" | "deployment" | "test-generator") => void;
  
  // New V2 Layout State
  v2LeftSidebarActiveTab: "explorer" | "search" | "git" | "database" | "extensions" | "mcp" | "settings";
  setV2LeftSidebarActiveTab: (tab: "explorer" | "search" | "git" | "database" | "extensions" | "mcp" | "settings") => void;
  v2BottomPanelActiveTab: "terminal" | "problems" | "output" | "debug-console";
  setV2BottomPanelActiveTab: (tab: "terminal" | "problems" | "output" | "debug-console") => void;
  v2BottomPanelVisible: boolean;
  toggleV2BottomPanel: () => void;
  v2RightPanelVisible: boolean;
  toggleV2RightPanel: () => void;
  v2SplitViewActive: boolean;
  toggleV2SplitView: () => void;
  v2SplitActiveEditorTab: string | null;
  setV2SplitActiveEditorTab: (id: string | null) => void;
  v2EditorTabs: FileNode[];
  setV2EditorTabs: (tabs: FileNode[]) => void;
  v2ActiveEditorTab: string | null;
  setV2ActiveEditorTab: (id: string | null) => void;
  rightPanelVisible: boolean;
  toggleRightPanel: () => void;
  bottomPanelVisible: boolean;
  toggleBottomPanel: () => void;
  bottomPanelActiveTab: "terminal" | "agent" | "logs" | "output";
  setBottomPanelActiveTab: (tab: "terminal" | "agent" | "logs" | "output") => void;
  terminal: TerminalSession;
  addTerminalLine: (line: Omit<TerminalLine, 'id' | 'timestamp'>) => void;
  setTerminalCommand: (command: string) => void;
  setTerminalRunning: (isRunning: boolean) => void;
  setTerminalStatus: (status: TerminalSession['status']) => void;
  clearTerminal: () => void;
  previewVisible: boolean;
  togglePreview: () => void;
  
  // New Layout State
  activityBarCollapsed: boolean;
  toggleActivityBar: () => void;
  leftSidebarCollapsed: boolean;
  toggleLeftSidebar: () => void;
  rightSidebarCollapsed: boolean;
  toggleRightSidebar: () => void;
  activeView: 'chat' | 'files' | 'search' | 'git' | 'settings';
  setActiveView: (view: 'chat' | 'files' | 'search' | 'git' | 'settings') => void;
  
  // Git State
  gitCurrentBranch: string;
  gitBranches: GitBranch[];
  gitChanges: GitFileChange[];
  gitCommits: GitCommit[];
  gitStagedFiles: string[];
  setGitCurrentBranch: (branch: string) => void;
  setGitBranches: (branches: GitBranch[]) => void;
  setGitChanges: (changes: GitFileChange[]) => void;
  setGitCommits: (commits: GitCommit[]) => void;
  setGitStagedFiles: (files: string[]) => void;
  stageFile: (path: string) => void;
  unstageFile: (path: string) => void;

  // AI Models
  selectedModel: ModelId;
  setSelectedModel: (model: ModelId) => void;

  // Project Memory
  projectMemory: ProjectMemory;
  setProjectMemory: (memory: Partial<ProjectMemory>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addToConversationHistory: (msg: Message) => void;
  clearConversationHistory: () => void;
  addAgentTaskToHistory: (task: AgentTask) => void;
  addGeneratedFile: (file: { id: string; path: string; name: string; content?: string; createdAt: number }) => void;
  addUserDecision: (decision: { id: string; decision: string; context?: string; createdAt: number }) => void;
  updateTechStack: (techStack: string[]) => void;
  initializeWorkspaceMemory: () => Promise<void>;
  saveWorkspaceMemory: () => Promise<void>;
  clearWorkspaceMemory: () => Promise<void>;

  // Codebase Indexing State
  isIndexing: boolean;
  setIsIndexing: (isIndexing: boolean) => void;
  indexProgress: number;
  setIndexProgress: (progress: number) => void;
  indexStatus: string;
  setIndexStatus: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  indexCodebase: () => Promise<void>;
  searchCodebase: (query: string) => Promise<void>;
  
  // Agent Mode State
  agentWorkflow: AgentWorkflow | null;
  setAgentWorkflow: (workflow: AgentWorkflow | null) => void;
  updateAgentWorkflowStatus: (status: AgentWorkflow['status']) => void;
  addAgentStep: (step: AgentStep) => void;
  updateAgentStep: (stepId: string, updates: Partial<AgentStep>) => void;
  addAgentAction: (action: AgentAction) => void;
  updateAgentAction: (actionId: string, updates: Partial<AgentAction>) => void;
  startAgentWorkflow: (prompt: string) => Promise<void>;
  addPendingFileChange: (change: AgentFileChange) => void;
  removePendingFileChange: (path: string) => void;
  applyAllPendingChanges: () => void;
  discardAllPendingChanges: () => void;
}

// Helper to flatten file tree into files with content
const flattenFileTree = (nodes: FileNode[]): { path: string; name: string; content: string }[] => {
  const files: { path: string; name: string; content: string }[] = [];
  for (const node of nodes) {
    if (node.type === 'file' && node.content) {
      files.push({ path: node.path, name: node.name, content: node.content });
    }
    if (node.children) {
      files.push(...flattenFileTree(node.children));
    }
  }
  return files;
};

const initialFileTree: FileNode[] = [
  {
    id: "root",
    name: "samai-project",
    type: "folder",
    isExpanded: true,
    path: "samai-project",
    children: [
      {
        id: "1",
        name: "index.html",
        type: "file",
        path: "samai-project/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAM AI Project</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
    <div id="app"></div>
</body>
</html>`,
      },
      {
        id: "style-css",
        name: "style.css",
        type: "file",
        path: "samai-project/style.css",
        content: `/* Custom Styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#app {
  width: 100%;
  height: 100vh;
}`,
      },
      {
        id: "2",
        name: "schema.prisma",
        type: "file",
        path: "samai-project/schema.prisma",
        content: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  posts Post[]
}

model Post {
  id      Int     @id @default(autoincrement())
  title   String
  content String?
  author  User    @relation(fields: [authorId], references: [id])
  authorId Int
}`,
      },
      {
        id: "3",
        name: "index.ts",
        type: "file",
        path: "samai-project/index.ts",
        content: `import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.json(user);
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});`,
      },
      {
        id: "4",
        name: "layout.tsx",
        type: "file",
        path: "samai-project/layout.tsx",
        content: `import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SAM AI Project',
  description: 'Created with SAM AI IDE',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`,
      },
      {
        id: "5",
        name: "app.js",
        type: "file",
        path: "samai-project/app.js",
        content: `// SAM AI Welcome Page
class App {
  constructor() {
    this.init();
  }

  init() {
    this.renderWelcome();
  }

  renderWelcome() {
    const app = document.getElementById('app');
    app.innerHTML = \`
      <div class="flex items-center justify-center min-h-screen p-4 relative">
        <div class="w-full max-w-2xl">
          <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div class="p-10 text-center">
              <div class="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6">
                <i class="fas fa-rocket text-white text-4xl"></i>
              </div>
              <h1 class="text-4xl font-bold text-gray-800 mb-4">Welcome to SAM AI!</h1>
              <p class="text-gray-500 text-lg mb-8">
                Your intelligent coding assistant is ready to help!
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div class="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-code text-white text-xl"></i>
                  </div>
                  <h3 class="font-semibold text-gray-800 mb-1">Write Code</h3>
                  <p class="text-sm text-gray-500">Build amazing apps fast</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl">
                  <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-palette text-white text-xl"></i>
                  </div>
                  <h3 class="font-semibold text-gray-800 mb-1">Design UI</h3>
                  <p class="text-sm text-gray-500">Create beautiful interfaces</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                  <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-rocket text-white text-xl"></i>
                  </div>
                  <h3 class="font-semibold text-gray-800 mb-1">Deploy Apps</h3>
                  <p class="text-sm text-gray-500">Ship your projects instantly</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-4 justify-center">
                <button id="exploreBtn" class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
                  <i class="fas fa-magic mr-2"></i>Get Started
                </button>
                <button id="resetBtn" class="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all">
                  <i class="fas fa-redo mr-2"></i>Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div class="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200">
            <div class="w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <i class="fas fa-robot text-white text-[8px]"></i>
            </div>
            <span class="text-xs text-gray-500 font-medium">Built by SAM AI</span>
          </div>
        </div>
      </div>
    \`;

    document.getElementById('exploreBtn').addEventListener('click', () => this.explore());
    document.getElementById('resetBtn').addEventListener('click', () => this.reset());
  }

  explore() {
    alert('Great! Start building your app in SAM AI!');
  }

  reset() {
    this.renderWelcome();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
`,
      }
    ],
  },
];

const findNode = (nodes: FileNode[], id: string): FileNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const findNodeByPath = (nodes: FileNode[], path: string): FileNode | null => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findNodeByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
};

const updateNode = (nodes: FileNode[], id: string, updates: Partial<FileNode>): FileNode[] => {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (node.children) {
      return { ...node, children: updateNode(node.children, id, updates) };
    }
    return node;
  });
};

const deleteNode = (nodes: FileNode[], id: string): FileNode[] => {
  return nodes.filter((node) => {
    if (node.id === id) return false;
    if (node.children) {
      node.children = deleteNode(node.children, id);
    }
    return true;
  });
};

const findParentNode = (nodes: FileNode[], id: string): FileNode | null => {
  for (const node of nodes) {
    if (node.children?.some((child) => child.id === id)) return node;
    if (node.children) {
      const found = findParentNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const generateId = () => Math.random().toString(36).slice(2, 11);

export const useAppStore = create<AppState>((set, get) => ({
  fileTree: initialFileTree,
  openFiles: [initialFileTree[0].children![0]],
  activeFile: initialFileTree[0].children![0],
  folderHandle: null,
  setFolderHandle: (handle: FileSystemDirectoryHandle | null) => set({ folderHandle: handle }),
  
  // Codebase Indexing Initial State
  isIndexing: false,
  setIsIndexing: (isIndexing: boolean) => set({ isIndexing }),
  indexProgress: 0,
  setIndexProgress: (progress: number) => set({ indexProgress: progress }),
  indexStatus: 'Ready to index',
  setIndexStatus: (status: string) => set({ indexStatus: status }),
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  searchResults: [],
  setSearchResults: (results: SearchResult[]) => set({ searchResults: results }),
  isSearching: false,
  setIsSearching: (isSearching: boolean) => set({ isSearching }),
  
  indexCodebase: async () => {
    set({ isIndexing: true, indexProgress: 0, indexStatus: 'Preparing to index...' });
    
    try {
      const files = flattenFileTree(get().fileTree);
      
      if (files.length === 0) {
        set({ isIndexing: false, indexStatus: 'No files to index' });
        return;
      }
      
      set({ indexStatus: 'Sending files for indexing...' });
      
      const response = await fetch('/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });
      
      if (!response.ok) throw new Error('Indexing failed');
      
      const data = await response.json();
      
      set({ 
        isIndexing: false, 
        indexProgress: 100, 
        indexStatus: `Indexed ${data.fileCount} files (${data.documentCount} chunks)` 
      });
    } catch (error) {
      console.error('Indexing error:', error);
      set({ 
        isIndexing: false, 
        indexStatus: 'Indexing failed',
        indexProgress: 0 
      });
    }
  },
  
  searchCodebase: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    
    set({ isSearching: true, searchQuery: query });
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, topK: 5 }),
      });
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      
      set({ searchResults: data.results, isSearching: false });
    } catch (error) {
      console.error('Search error:', error);
      set({ isSearching: false });
    }
  },
  
  // Agent Mode
  agentWorkflow: null,
  setAgentWorkflow: (workflow: AgentWorkflow | null) => set({ agentWorkflow: workflow }),
  
  updateAgentWorkflowStatus: (status: AgentWorkflow['status']) => 
    set((state) => {
      if (!state.agentWorkflow) return state;
      return {
        agentWorkflow: {
          ...state.agentWorkflow,
          status
        }
      };
    }),
  
  addAgentStep: (step: AgentStep) => 
    set((state) => {
      if (!state.agentWorkflow) return state;
      return {
        agentWorkflow: {
          ...state.agentWorkflow,
          steps: [...state.agentWorkflow.steps, step]
        }
      };
    }),
  
  updateAgentStep: (stepId: string, updates: Partial<AgentStep>) => 
    set((state) => {
      if (!state.agentWorkflow) return state;
      return {
        agentWorkflow: {
          ...state.agentWorkflow,
          steps: state.agentWorkflow.steps.map((step) =>
            step.id === stepId ? { ...step, ...updates } : step
          )
        }
      };
    }),
  
  addAgentAction: (action: AgentAction) => 
    set((state) => {
      if (!state.agentWorkflow) return state;
      return {
        agentWorkflow: {
          ...state.agentWorkflow,
          actions: [...state.agentWorkflow.actions, action]
        }
      };
    }),
  
  updateAgentAction: (actionId: string, updates: Partial<AgentAction>) => 
    set((state) => {
      if (!state.agentWorkflow) return state;
      return {
        agentWorkflow: {
          ...state.agentWorkflow,
          actions: state.agentWorkflow.actions.map((action) =>
            action.id === actionId ? { ...action, ...updates } : action
          )
        }
      };
    }),

  addPendingFileChange: (change: AgentFileChange) => 
    set((state) => {
      if (!state.agentWorkflow) return state;
      return {
        agentWorkflow: {
          ...state.agentWorkflow,
          pendingFileChanges: [...state.agentWorkflow.pendingFileChanges, change]
        }
      };
    }),

  removePendingFileChange: (path: string) => 
    set((state) => {
      if (!state.agentWorkflow) return state;
      return {
        agentWorkflow: {
          ...state.agentWorkflow,
          pendingFileChanges: state.agentWorkflow.pendingFileChanges.filter(c => c.path !== path)
        }
      };
    }),

  applyAllPendingChanges: () => {
    const state = get();
    if (!state.agentWorkflow) return;
    
    let newFileTree = [...state.fileTree];
    
    for (const change of state.agentWorkflow.pendingFileChanges) {
      if (change.type === 'create') {
        const pathParts = change.path.split('/');
        const fileName = pathParts.pop() || '';
        const parentPath = pathParts.join('/');
        
        let parent = findNodeByPath(newFileTree, parentPath);
        if (!parent) {
          parent = findNodeByPath(newFileTree, 'samai-project');
        }
        
        if (parent && parent.type === 'folder') {
          const newNode: FileNode = {
            id: generateId(),
            name: fileName,
            type: 'file',
            content: change.content || '',
            path: change.path,
          };
          newFileTree = updateNode(newFileTree, parent.id, {
            children: [...(parent.children || []), newNode]
          });
        }
      } else if (change.type === 'modify') {
        const node = findNodeByPath(newFileTree, change.path);
        if (node && node.type === 'file') {
          newFileTree = updateNode(newFileTree, node.id, {
            content: change.content || ''
          });
        }
      } else if (change.type === 'delete') {
        const node = findNodeByPath(newFileTree, change.path);
        if (node) {
          newFileTree = deleteNode(newFileTree, node.id);
        }
      }
    }
    
    const newOpenFiles = newFileTree.flatMap(node => {
      const flatten = (n: FileNode): FileNode[] => {
        const result: FileNode[] = n.type === 'file' ? [n] : [];
        if (n.children) {
          result.push(...n.children.flatMap(flatten));
        }
        return result;
      };
      return flatten(node);
    }).filter(node => state.openFiles.some(f => f.path === node.path));
    
    const newActiveFile = newOpenFiles.find(f => f.path === state.activeFile?.path) || null;
    
    set({
      fileTree: newFileTree,
      openFiles: newOpenFiles,
      activeFile: newActiveFile,
      agentWorkflow: {
        ...state.agentWorkflow,
        status: 'completed',
        pendingFileChanges: []
      }
    });
  },

  discardAllPendingChanges: () => {
    set((state) => {
      if (!state.agentWorkflow) return state;
      return {
        agentWorkflow: {
          ...state.agentWorkflow,
          status: 'idle',
          pendingFileChanges: []
        }
      };
    });
  },
  
  startAgentWorkflow: async (prompt: string) => {
    // Initialize workflow
    const workflowId = generateId();
    set({
      agentWorkflow: {
        id: workflowId,
        userPrompt: prompt,
        status: "analyzing",
        steps: [],
        actions: [],
        pendingFileChanges: []
      }
    });

    // Simulate creating some file changes
    setTimeout(() => {
      set((state) => {
        if (!state.agentWorkflow) return state;
        
        // Add some sample pending changes
        const pendingFileChanges: AgentFileChange[] = [
          {
            path: 'samai-project/Login.tsx',
            type: 'create',
            content: `export default function Login() {
  return (
    <div className="p-4 bg-gray-100">
      <h1>Login Component</h1>
    </div>
  );
}`,
            status: 'pending'
          },
          {
            path: 'samai-project/auth.ts',
            type: 'create',
            content: `export const login = (email: string, password: string) => {
  console.log('Logging in:', email);
};`,
            status: 'pending'
          },
          {
            path: 'samai-project/api.ts',
            type: 'create',
            content: `export const apiClient = {
  login: async (data: { email: string; password: string }) => {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
};`,
            status: 'pending'
          }
        ];
        
        return {
          agentWorkflow: {
            ...state.agentWorkflow,
            status: 'pendingReview',
            pendingFileChanges
          }
        };
      });
    }, 2000);
  },
  
  // AI Models
  selectedModel: 'gpt-4o',
  setSelectedModel: (model: ModelId) => set({ selectedModel: model }),

  // V2 Layout defaults
  v2LeftSidebarActiveTab: 'explorer',
  setV2LeftSidebarActiveTab: (tab) => set({ v2LeftSidebarActiveTab: tab }),
  v2BottomPanelActiveTab: 'terminal',
  setV2BottomPanelActiveTab: (tab) => set({ v2BottomPanelActiveTab: tab }),
  v2BottomPanelVisible: false,
  toggleV2BottomPanel: () => set((state) => ({ v2BottomPanelVisible: !state.v2BottomPanelVisible })),
  v2RightPanelVisible: true,
  toggleV2RightPanel: () => set((state) => ({ v2RightPanelVisible: !state.v2RightPanelVisible })),
  v2SplitViewActive: false,
  toggleV2SplitView: () => set((state) => ({ v2SplitViewActive: !state.v2SplitViewActive })),
  v2SplitActiveEditorTab: null,
  setV2SplitActiveEditorTab: (id) => set({ v2SplitActiveEditorTab: id }),
  v2EditorTabs: [],
  setV2EditorTabs: (tabs) => set({ v2EditorTabs: tabs }),
  v2ActiveEditorTab: null,
  setV2ActiveEditorTab: (id) => set({ v2ActiveEditorTab: id }),
  
  // New Layout State
  activityBarCollapsed: false,
  toggleActivityBar: () => set((state) => ({ activityBarCollapsed: !state.activityBarCollapsed })),
  leftSidebarCollapsed: false,
  toggleLeftSidebar: () => set((state) => ({ leftSidebarCollapsed: !state.leftSidebarCollapsed })),
  rightSidebarCollapsed: false,
  toggleRightSidebar: () => set((state) => ({ rightSidebarCollapsed: !state.rightSidebarCollapsed })),
  activeView: 'chat',
  setActiveView: (view: 'chat' | 'files' | 'search' | 'git' | 'settings') => set({ activeView: view }),

  openFolder: async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
      set({ folderHandle: handle });
      const tree = await get().loadFolderTree(handle, handle.name);
      set({ fileTree: tree });
    } catch (err) {
      console.error('Failed to open folder:', err);
    }
  },

  loadFolderTree: async (handle: FileSystemDirectoryHandle, parentPath: string = ''): Promise<FileNode[]> => {
    const nodes: FileNode[] = [];
    for await (const [name, entry] of handle.entries()) {
      const path = parentPath ? `${parentPath}/${name}` : name;
      if (entry.kind === 'directory') {
        const children = await get().loadFolderTree(entry, path);
        nodes.push({
          id: generateId(),
          name,
          type: 'folder',
          path,
          handle: entry,
          isExpanded: true,
          children,
        });
      } else {
        nodes.push({
          id: generateId(),
          name,
          type: 'file',
          path,
          handle: entry,
        });
      }
    }
    return nodes;
  },

  loadFileContent: async (fileId: string) => {
    const state = get();
    const node = findNode(state.fileTree, fileId);
    if (node && node.type === 'file' && node.handle) {
      try {
        const file = await (node.handle as FileSystemFileHandle).getFile();
        const text = await file.text();
        set((s) => {
          const newFileTree = updateNode(s.fileTree, fileId, { content: text });
          let newOpenFiles = s.openFiles;
          let newActiveFile = s.activeFile;
          
          const alreadyOpen = newOpenFiles.find(f => f.id === fileId);
          if (!alreadyOpen) {
            const updatedNode = findNode(newFileTree, fileId);
            if (updatedNode) {
              newOpenFiles = [...newOpenFiles, updatedNode];
            }
          }

          if (s.activeFile?.id === fileId) {
            newActiveFile = findNode(newFileTree, fileId) || null;
          } else if (!alreadyOpen) {
            const updatedNode = findNode(newFileTree, fileId);
            newActiveFile = updatedNode || s.activeFile;
          }

          return { 
            fileTree: newFileTree, 
            openFiles: newOpenFiles, 
            activeFile: newActiveFile,
            v2EditorTabs: newOpenFiles,
            v2ActiveEditorTab: newActiveFile?.id || null
          };
        });
      } catch (err) {
        console.error('Failed to load file:', err);
      }
    }
  },

  saveFileToDisk: async (fileId: string) => {
    const state = get();
    const node = findNode(state.fileTree, fileId);
    if (node && node.type === 'file' && node.handle && node.content !== undefined) {
      try {
        const writable = await (node.handle as FileSystemFileHandle).createWritable();
        await writable.write(node.content);
        await writable.close();
      } catch (err) {
        console.error('Failed to save file:', err);
      }
    }
  },

  createFileOnDisk: async (parentId: string, name: string, type: 'file' | 'folder', content?: string) => {
    const state = get();
    const parentNode = findNode(state.fileTree, parentId);
    if (parentNode && parentNode.type === 'folder' && parentNode.handle) {
      try {
        let newHandle;
        if (type === 'folder') {
          newHandle = await (parentNode.handle as FileSystemDirectoryHandle).getDirectoryHandle(name, { create: true });
        } else {
          newHandle = await (parentNode.handle as FileSystemDirectoryHandle).getFileHandle(name, { create: true });
          if (content) {
            const writable = await (newHandle as FileSystemFileHandle).createWritable();
            await writable.write(content);
            await writable.close();
          }
        }
        
        get().createFile(parentId, name, type, content);
        const newTree = get().fileTree;
        const updatedParent = findNode(newTree, parentId);
        if (updatedParent && updatedParent.children) {
          const newNode = updatedParent.children.find(c => c.name === name);
          if (newNode) {
            set((s) => {
              const newFileTree = updateNode(s.fileTree, newNode.id, { handle: newHandle });
              return { fileTree: newFileTree };
            });
          }
        }
      } catch (err) {
        console.error('Failed to create file:', err);
      }
    }
  },

  deleteFileFromDisk: async (fileId: string) => {
    const state = get();
    const node = findNode(state.fileTree, fileId);
    const parent = findParentNode(state.fileTree, fileId);
    if (node && parent && parent.handle) {
      try {
        await (parent.handle as FileSystemDirectoryHandle).removeEntry(node.name, { recursive: true });
        get().deleteFile(fileId);
      } catch (err) {
        console.error('Failed to delete file:', err);
      }
    }
  },

  renameFileOnDisk: async (fileId: string, newName: string) => {
    const state = get();
    const node = findNode(state.fileTree, fileId);
    if (!node) return;

    const parent = findParentNode(state.fileTree, fileId);
    if (parent && parent.handle) {
      try {
        if (node.type === 'file' && node.handle) {
          const file = await (node.handle as FileSystemFileHandle).getFile();
          const content = await file.text();
          const newHandle = await (parent.handle as FileSystemDirectoryHandle).getFileHandle(newName, { create: true });
          const writable = await newHandle.createWritable();
          await writable.write(content);
          await writable.close();
          await (parent.handle as FileSystemDirectoryHandle).removeEntry(node.name);
          
          get().renameFile(fileId, newName);
          
          set((s) => {
            const newFileTree = updateNode(s.fileTree, fileId, {
              handle: newHandle
            });
            return { fileTree: newFileTree };
          });
        } else if (node.type === 'folder' && node.handle && node.children) {
          const newFolderHandle = await (parent.handle as FileSystemDirectoryHandle).getDirectoryHandle(newName, { create: true });
          const copyFolder = async (src: FileSystemDirectoryHandle, dest: FileSystemDirectoryHandle) => {
            for await (const [name, entry] of src.entries()) {
              if (entry.kind === 'file') {
                const file = await entry.getFile();
                const newFile = await dest.getFileHandle(name, { create: true });
                const writable = await newFile.createWritable();
                await writable.write(await file.text());
                await writable.close();
              } else {
                const subDest = await dest.getDirectoryHandle(name, { create: true });
                await copyFolder(entry, subDest);
              }
            }
          };
          await copyFolder(node.handle as FileSystemDirectoryHandle, newFolderHandle);
          await (parent.handle as FileSystemDirectoryHandle).removeEntry(node.name, { recursive: true });
          
          get().renameFile(fileId, newName);
          
          set((s) => {
            const newFileTree = updateNode(s.fileTree, fileId, {
              handle: newFolderHandle
            });
            return { fileTree: newFileTree };
          });
        }
      } catch (err) {
        console.error('Failed to rename file:', err);
      }
    }
  },
  setActiveFile: (file: FileNode | null) => {
    if (file && file.type === "file") {
      const current = get();
      const alreadyOpen = current.openFiles.find((f) => f.id === file.id);
      if (!alreadyOpen) {
        set({ openFiles: [...current.openFiles, file] });
      }
      set({ activeFile: file });
    }
  },
  updateFileContent: (fileId: string, content: string) =>
    set((state: AppState) => {
      const newFileTree = updateNode(state.fileTree, fileId, { content });
      const newOpenFiles = state.openFiles.map((f) =>
        f.id === fileId ? { ...f, content } : f
      );
      const newActiveFile =
        state.activeFile?.id === fileId
          ? { ...state.activeFile, content }
          : state.activeFile;
      return { fileTree: newFileTree, openFiles: newOpenFiles, activeFile: newActiveFile };
    }),
  closeFile: (fileId: string) =>
    set((state: AppState) => {
      const newOpenFiles = state.openFiles.filter((f) => f.id !== fileId);
      let newActiveFile = state.activeFile;
      if (state.activeFile?.id === fileId) {
        newActiveFile = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
      }
      return { openFiles: newOpenFiles, activeFile: newActiveFile };
    }),
  toggleFolder: (folderId: string) =>
    set((state: AppState) => {
      const folder = findNode(state.fileTree, folderId);
      if (folder && folder.type === "folder") {
        const newFileTree = updateNode(state.fileTree, folderId, {
          isExpanded: !folder.isExpanded,
        });
        return { fileTree: newFileTree };
      }
      return state;
    }),
  createFile: (parentId: string | null, name: string, type: 'file' | 'folder', content?: string) =>
    set((state: AppState) => {
      const newNode: FileNode = {
        id: generateId(),
        name,
        type,
        path: '',
        isExpanded: type === 'folder',
        children: type === 'folder' ? [] : undefined,
        content: type === 'file' ? (content || '') : undefined,
      };

      if (!parentId) {
        return { fileTree: [...state.fileTree, newNode] };
      }

      const parent = findNode(state.fileTree, parentId);
      if (parent && parent.type === 'folder') {
        newNode.path = parent.path ? `${parent.path}/${name}` : name;
        const newParent = {
          ...parent,
          isExpanded: true,
          children: [...(parent.children || []), newNode],
        };
        const newFileTree = updateNode(state.fileTree, parentId, newParent);
        return { fileTree: newFileTree };
      }
      return state;
    }),
  deleteFile: (fileId: string) =>
    set((state: AppState) => {
      const newFileTree = deleteNode(state.fileTree, fileId);
      const newOpenFiles = state.openFiles.filter((f) => f.id !== fileId);
      let newActiveFile = state.activeFile;
      if (state.activeFile?.id === fileId) {
        newActiveFile = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
      }
      return { fileTree: newFileTree, openFiles: newOpenFiles, activeFile: newActiveFile };
    }),
  renameFile: (fileId: string, newName: string) =>
    set((state: AppState) => {
      const node = findNode(state.fileTree, fileId);
      if (!node) return state;

      const parent = findParentNode(state.fileTree, fileId);
      const newPath = parent ? `${parent.path}/${newName}` : newName;

      const updatePathRecursively = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((n) => {
          if (n.id === fileId) {
            return { ...n, name: newName, path: newPath };
          }
          if (n.children) {
            return { ...n, children: updatePathRecursively(n.children) };
          }
          return n;
        });
      };

      const newFileTree = updatePathRecursively(state.fileTree);
      const newOpenFiles = state.openFiles.map((f) =>
        f.id === fileId ? { ...f, name: newName, path: newPath } : f
      );
      const newActiveFile =
        state.activeFile?.id === fileId
          ? { ...state.activeFile, name: newName, path: newPath }
          : state.activeFile;

      return { fileTree: newFileTree, openFiles: newOpenFiles, activeFile: newActiveFile };
    }),
  getFileByPath: (path: string) => {
    const state = get();
    return findNodeByPath(state.fileTree, path);
  },
  messages: [
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm SAM AI, your AI coding assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ],
  addMessage: (message: Message) =>
    set((state: AppState) => ({ messages: [...state.messages, message] })),
  updateMessage: (messageId: string, updates: Partial<Message>) =>
    set((state: AppState) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    })),
  agentTasks: [],
  addAgentTask: (task: AgentTask) =>
    set((state: AppState) => ({ agentTasks: [...state.agentTasks, task] })),
  updateAgentTask: (taskId: string, updates: Partial<AgentTask>) =>
    set((state: AppState) => ({
      agentTasks: state.agentTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })),
  addFileChangeToTask: (taskId: string, fileChange: AgentFileChange) =>
    set((state: AppState) => ({
      agentTasks: state.agentTasks.map((task) =>
        task.id === taskId
          ? { ...task, fileChanges: [...task.fileChanges, fileChange] }
          : task
      ),
    })),
  updateStepInTask: (taskId: string, stepId: string, updates: Partial<AgentStep>) =>
    set((state: AppState) => ({
      agentTasks: state.agentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              steps: task.steps.map((step) =>
                step.id === stepId ? { ...step, ...updates } : step
              ),
            }
          : task
      ),
    })),
  sidebarActiveTab: "files",
  setSidebarActiveTab: (tab: "projects" | "files" | "search" | "git" | "memory") =>
    set({ sidebarActiveTab: tab }),
  rightPanelActiveTab: "chat",
  setRightPanelActiveTab: (tab: "chat" | "agent" | "search" | "file-ops" | "project-generator" | "professional-mode" | "multi-agent" | "master-builder" | "deployment" | "test-generator") =>
    set({ rightPanelActiveTab: tab }),
  rightPanelVisible: true,
  toggleRightPanel: () =>
    set((state: AppState) => ({ rightPanelVisible: !state.rightPanelVisible })),
  bottomPanelVisible: true,
  toggleBottomPanel: () =>
    set((state: AppState) => ({ bottomPanelVisible: !state.bottomPanelVisible })),
  bottomPanelActiveTab: "terminal",
  setBottomPanelActiveTab: (tab: "terminal" | "agent" | "logs" | "output") =>
    set({ bottomPanelActiveTab: tab }),
  previewVisible: true,
  togglePreview: () =>
    set((state: AppState) => ({ previewVisible: !state.previewVisible })),
  
  // Terminal State
  terminal: {
    id: 'main',
    lines: [
      { id: 'init-1', type: 'info', content: 'Welcome to SAM AI Terminal', timestamp: Date.now() },
      { id: 'init-2', type: 'info', content: 'Type commands or let the Agent run them!', timestamp: Date.now() },
    ],
    currentCommand: '',
    isRunning: false,
    status: 'idle'
  },
  
  addTerminalLine: (line) =>
    set((state: AppState) => ({
      terminal: {
        ...state.terminal,
        lines: [
          ...state.terminal.lines,
          {
            ...line,
            id: generateId(),
            timestamp: Date.now()
          }
        ]
      }
    })),
  
  setTerminalCommand: (command) =>
    set((state: AppState) => ({
      terminal: { ...state.terminal, currentCommand: command }
    })),
  
  setTerminalRunning: (isRunning) =>
    set((state: AppState) => ({
      terminal: { ...state.terminal, isRunning }
    })),
  
  setTerminalStatus: (status) =>
    set((state: AppState) => ({
      terminal: { ...state.terminal, status }
    })),
  
  clearTerminal: () =>
    set((state: AppState) => ({
      terminal: {
        ...state.terminal,
        lines: []
      }
    })),
  
  // Git State
  gitCurrentBranch: 'main',
  gitBranches: [
    { name: 'main', isCurrent: true },
    { name: 'develop', isCurrent: false },
    { name: 'feature/new-ui', isCurrent: false }
  ],
  gitChanges: [
    { path: 'samai-project/index.html', status: 'modified', originalContent: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>SAM AI</title>\n</head>\n<body></body>\n</html>', newContent: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>SAM AI Demo</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' },
    { path: 'samai-project/app.js', status: 'added', newContent: 'console.log("Hello from SAM AI");' }
  ],
  gitCommits: [
    { id: 'abc123', message: 'Initial commit', date: new Date(Date.now() - 86400000), author: 'SAM AI' },
    { id: 'def456', message: 'Add basic UI components', date: new Date(Date.now() - 3600000), author: 'SAM AI' }
  ],
  gitStagedFiles: [],
  
  setGitCurrentBranch: (branch) =>
    set((state: AppState) => ({
      gitCurrentBranch: branch,
      gitBranches: state.gitBranches.map(b => ({ ...b, isCurrent: b.name === branch }))
    })),
  
  setGitBranches: (branches) => set({ gitBranches: branches }),
  
  setGitChanges: (changes) => set({ gitChanges: changes }),
  
  setGitCommits: (commits) => set({ gitCommits: commits }),
  
  setGitStagedFiles: (files) => set({ gitStagedFiles: files }),
  
  stageFile: (path) =>
    set((state: AppState) => ({
      gitStagedFiles: [...state.gitStagedFiles, path]
    })),
  
  unstageFile: (path: string) =>
    set((state: AppState) => ({
      gitStagedFiles: state.gitStagedFiles.filter(p => p !== path)
    })),
  // Project Memory State
  projectMemory: {
    architecture: [
      {
        id: 'root-arch',
        name: 'samai-project',
        type: 'folder',
        children: [
          { id: 'index-html', name: 'index.html', type: 'file', path: 'samai-project/index.html', description: 'Main HTML entry point' },
          { id: 'style-css', name: 'style.css', type: 'file', path: 'samai-project/style.css', description: 'Global styles' },
          { id: 'app-js', name: 'app.js', type: 'file', path: 'samai-project/app.js', description: 'Main JS application' },
          {
            id: 'src-folder',
            name: 'src',
            type: 'folder',
            children: [
              {
                id: 'components-folder',
                name: 'components',
                type: 'folder',
                children: [
                  { id: 'button-js', name: 'Button.js', type: 'component', path: 'samai-project/src/components/Button.js', description: 'Reusable Button component' }
                ]
              },
              { id: 'utils-js', name: 'utils.js', type: 'file', path: 'samai-project/src/utils.js', description: 'Utility functions' }
            ]
          }
        ]
      }
    ],
    preferences: {
      theme: 'dark',
      fontSize: 14,
      autoSave: true,
      language: 'en'
    },
    previousConversations: [],
    agentTaskHistory: [],
    generatedFiles: [],
    userDecisions: [],
    techStack: []
  },
  setProjectMemory: (memory) => {
    set((state: AppState) => ({
      projectMemory: { ...state.projectMemory, ...memory }
    }));
    get().saveWorkspaceMemory();
  },
  updatePreferences: (prefs) => {
    set((state: AppState) => ({
      projectMemory: {
        ...state.projectMemory,
        preferences: { ...state.projectMemory.preferences, ...prefs }
      }
    }));
    get().saveWorkspaceMemory();
  },
  addToConversationHistory: (msg) => {
    set((state: AppState) => ({
      projectMemory: {
        ...state.projectMemory,
        previousConversations: [...state.projectMemory.previousConversations, msg]
      }
    }));
    get().saveWorkspaceMemory();
  },
  clearConversationHistory: () => {
    set((state: AppState) => ({
      projectMemory: {
        ...state.projectMemory,
        previousConversations: [],
      },
    }));
    get().saveWorkspaceMemory();
  },
  addAgentTaskToHistory: (task) => {
    set((state: AppState) => ({
      projectMemory: {
        ...state.projectMemory,
        agentTaskHistory: [...state.projectMemory.agentTaskHistory, task],
      },
    }));
    get().saveWorkspaceMemory();
  },
  addGeneratedFile: (file) => {
    set((state: AppState) => ({
      projectMemory: {
        ...state.projectMemory,
        generatedFiles: [...state.projectMemory.generatedFiles, file],
      },
    }));
    get().saveWorkspaceMemory();
  },
  addUserDecision: (decision) => {
    set((state: AppState) => ({
      projectMemory: {
        ...state.projectMemory,
        userDecisions: [...state.projectMemory.userDecisions, decision],
      },
    }));
    get().saveWorkspaceMemory();
  },
  updateTechStack: (techStack) => {
    set((state: AppState) => ({
      projectMemory: {
        ...state.projectMemory,
        techStack,
      },
    }));
    get().saveWorkspaceMemory();
  },
  initializeWorkspaceMemory: async () => {
    await workspaceMemoryDB.init();
    const saved = await workspaceMemoryDB.getMemory();
    if (saved?.projectMemory) {
      set({ projectMemory: saved.projectMemory });
    }
  },
  saveWorkspaceMemory: async () => {
    const state = get();
    await workspaceMemoryDB.saveMemory({
      projectMemory: state.projectMemory
    });
  },
  clearWorkspaceMemory: async () => {
    await workspaceMemoryDB.clearMemory();
    const state = get();
    set({
      projectMemory: {
        architecture: [],
        preferences: state.projectMemory.preferences,
        previousConversations: [],
        agentTaskHistory: [],
        generatedFiles: [],
        userDecisions: [],
        techStack: []
      }
    });
  }
}));
