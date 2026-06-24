'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Zap,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Play,
  Database,
  Cog,
  Monitor,
  GitBranch,
  FileCode,
  TestTube,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const generateId = () => Math.random().toString(36).slice(2, 11);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface BuilderStep {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'pending' | 'running' | 'completed';
  output?: string;
}

export function MasterBuilder() {
  const {
    addTerminalLine,
    createFile,
    fileTree,
  updateFileContent,
    getFileByPath,
  deleteFile,
  renameFile,
  openFiles,
    setActiveFile,
  fileTree: currentFileTree,
  createFile: storeCreateFile,
    closeFile,
  toggleFolder,
  activeFile,
  agentTasks,
    addAgentTask,
    updateAgentTask,
    updateStepInTask,
    addAgentTaskToHistory,
  setRightPanelActiveTab,
    toggleRightPanel,
    rightPanelActiveTab,
    rightPanelVisible,
    bottomPanelVisible,
    toggleBottomPanel,
    setBottomPanelActiveTab,
    bottomPanelActiveTab,
    terminal,
    addTerminalLine: storeAddTerminalLine,
    setTerminalCommand,
    setTerminalRunning,
    setTerminalStatus,
    clearTerminal,
    previewVisible,
    togglePreview,
    gitCurrentBranch,
    gitBranches,
    gitChanges,
    gitCommits,
    gitStagedFiles,
    setGitCurrentBranch,
    setGitBranches,
    setGitChanges,
    setGitCommits,
    setGitStagedFiles,
    stageFile,
    unstageFile,
    projectMemory,
    setProjectMemory,
    updatePreferences,
    addToConversationHistory,
    clearConversationHistory,
    sidebarActiveTab,
    setSidebarActiveTab,
    messages,
    addMessage,
    updateMessage,
  } = useAppStore();

  const [prompt, setPrompt] = useState('');
  const [steps, setSteps] = useState<BuilderStep[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const masterBuilderSteps = [
    { id: 'req', name: 'Analyze Requirements', icon: Zap },
    { id: 'arch', name: 'Create Architecture', icon: Cog },
    { id: 'db', name: 'Build Database', icon: Database },
    { id: 'frontend', name: 'Create Frontend', icon: Monitor },
    { id: 'backend', name: 'Create Backend', icon: Cog },
    { id: 'auth', name: 'Implement Auth', icon: Zap },
    { id: 'api', name: 'Build APIs', icon: GitBranch },
    { id: 'deploy', name: 'Deployment Config', icon: Rocket },
    { id: 'tests', name: 'Write Tests', icon: TestTube },
    { id: 'review', name: 'Review & QA', icon: CheckCircle2 },
  ];

  const startBuilding = async () => {
    if (!prompt.trim()) return;
    setIsBuilding(true);

    const initialSteps = masterBuilderSteps.map(step => ({
      ...step,
      status: 'pending' as const,
    }));

    setSteps(initialSteps);
    setExpandedStep(null);
    addTerminalLine({ type: 'info', content: `$ [Master Builder] Starting build for: ${prompt}` });

    for (let i = 0; i < initialSteps.length; i++) {
      // Mark as running
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'running' } : s
      ));
      addTerminalLine({ type: 'info', content: `$ [Master Builder] ${initialSteps[i].name}...` });

      await delay(1500);

      // Generate output and file
      let output = '';
      let fileName = `${initialSteps[i].name.toLowerCase().replace(/\s+/g, '-')}.md`;
      if (i === 0) {
        output = `# Requirements Analysis
- Project: ${prompt}
- Core Features: ${prompt.includes('ecommerce') ? 'Products, Cart, Checkout' : prompt.includes('crm') ? 'Leads, Contacts, Deals' : 'Auth, Dashboard, Settings'}
- Tech Stack: Next.js, Tailwind CSS, Prisma, PostgreSQL
`;
      } else if (i === 1) {
        output = `# Project Architecture
- Frontend: Next.js 15, React 19, Tailwind CSS
- Backend: Next.js API Routes
- Database: PostgreSQL with Prisma
- Deployment: Vercel (Frontend), Railway (DB)
`;
      } else if (i === 2) {
        output = `# Database Schema
model User { id String @id @default(cuid()) email String @unique name String password String createdAt DateTime @default(now()) }
`;
      } else if (i === 3) {
        output = `# Frontend Components
- Navbar.tsx
- Dashboard.tsx
- Login.tsx
- Register.tsx
- ProtectedRoute.tsx
`;
      } else if (i === 4) {
        output = `# Backend API
- /api/auth/register
- /api/auth/login
- /api/auth/me
- /api/[resource]/...
`;
      } else if (i === 5) {
        output = `# Authentication
- JWT Tokens
- Session Management
- Password Hashing (bcrypt)
`;
      } else if (i === 6) {
        output = `# REST API Endpoints
- GET /api/[resource]
- POST /api/[resource]
- PUT /api/[resource]/:id
- DELETE /api/[resource]/:id
`;
      } else if (i === 7) {
        output = `# Deployment Files
- Dockerfile
- docker-compose.yml
- vercel.json
- .env.example
`;
      } else if (i === 8) {
        output = `# Tests
- Unit Tests
- Integration Tests
- E2E Tests
`;
      } else if (i === 9) {
        output = `# QA Review
- All files syntax checked
- Authentication flow tested
- Responsive design verified
`;
      }

      createFile(fileTree[0]?.id || null, fileName, 'file', output);

      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'completed', output } : s
      ));
    }

    setIsBuilding(false);
    addTerminalLine({ type: 'info', content: '$ [Master Builder] Build complete!' });
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-7 w-7 text-purple-500" />
          <h2 className="text-2xl font-bold text-white">SAM AI Builder</h2>
        </div>

        {steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <Rocket className="h-16 w-16 text-purple-500" />
            <h3 className="text-xl font-semibold text-white">Master Builder Mode</h3>
            <p className="text-gray-400 max-w-sm">
              Tell us what to build and we'll create the complete full-stack project!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedStep(expandedStep === step.id ? null : step.id)
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : step.status === 'running' ? (
                      <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-gray-500" />
                    )}
                    <div className="flex items-center gap-3">
                      <step.icon className="h-4 w-4 text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium text-white">{step.name}</p>
                      </div>
                    </div>
                  </div>
                </button>

                {expandedStep === step.id && step.output && (
                  <div className="border-t border-gray-700 p-4">
                    <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {step.output}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="flex gap-2 flex-col">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to build today? e.g., 'Build a complete e-commerce platform with products, cart, checkout, and admin panel'"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors min-h-[120px]"
          />
          <button
            onClick={startBuilding}
            disabled={isBuilding || !prompt.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
          >
            {isBuilding ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Building...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Build Complete Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
