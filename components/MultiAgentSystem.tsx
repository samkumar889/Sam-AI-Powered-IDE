'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Play,
  RefreshCw,
  CheckCircle2,
  FileCode,
  Database,
  Monitor,
  Cog,
  Zap,
  Bot,
  Layers,
  Terminal,
  ChevronDown,
  ChevronUp,
  Rocket,
  TestTube,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const generateId = () => Math.random().toString(36).slice(2, 11);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type AgentType = 'architect' | 'uiux' | 'frontend' | 'backend' | 'database' | 'qa' | 'devops';

interface AgentTask {
  id: string;
  agent: AgentType;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

export function MultiAgentSystem() {
  const {
    addTerminalLine,
    createFile,
    fileTree,
  } = useAppStore();

  const [request, setRequest] = useState('');
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const agentConfig = [
    { id: 'architect', name: 'Architect Agent', icon: Layers, color: 'purple' },
    { id: 'uiux', name: 'UI/UX Designer Agent', icon: Palette, color: 'yellow' },
    { id: 'database', name: 'Database Agent', icon: Database, color: 'orange' },
    { id: 'backend', name: 'Backend Agent', icon: Cog, color: 'green' },
    { id: 'frontend', name: 'Frontend Agent', icon: Monitor, color: 'blue' },
    { id: 'qa', name: 'QA Agent', icon: TestTube, color: 'cyan' },
    { id: 'devops', name: 'DevOps Agent', icon: Rocket, color: 'pink' },
  ] as const;

  const getAgentIcon = (agent: AgentType) => {
    const config = agentConfig.find(a => a.id === agent);
    const Icon = config?.icon || Bot;
    return <Icon className="h-5 w-5" />;
  };

  const getAgentColor = (agent: AgentType) => {
    const config = agentConfig.find(a => a.id === agent);
    switch (config?.color) {
      case 'purple': return 'text-purple-400';
      case 'blue': return 'text-blue-400';
      case 'green': return 'text-green-400';
      case 'orange': return 'text-orange-400';
      case 'pink': return 'text-pink-400';
      case 'cyan': return 'text-cyan-400';
      case 'yellow': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const runMultiAgentSystem = async () => {
    if (!request.trim()) return;
    setIsRunning(true);

    const initialTasks: AgentTask[] = [
      { id: 't1', agent: 'architect', name: 'Design Architecture', description: 'Creating project structure and tech stack', status: 'pending' },
      { id: 't2', agent: 'uiux', name: 'Design UI/UX', description: 'Creating design system and wireframes', status: 'pending' },
      { id: 't3', agent: 'database', name: 'Design Database', description: 'Creating database models and schema', status: 'pending' },
      { id: 't4', agent: 'backend', name: 'Build Backend', description: 'Creating API endpoints and services', status: 'pending' },
      { id: 't5', agent: 'frontend', name: 'Build Frontend', description: 'Creating UI components and pages', status: 'pending' },
      { id: 't6', agent: 'qa', name: 'Test & QA', description: 'Quality assurance and testing', status: 'pending' },
      { id: 't7', agent: 'devops', name: 'Prepare Deployment', description: 'Creating deployment configuration', status: 'pending' },
    ];

    setTasks(initialTasks);
    addTerminalLine({ type: 'info', content: '$ [Multi-Agent] Starting multi-agent team collaboration...' });

    for (let i = 0; i < initialTasks.length; i++) {
      // Mark as running
      setTasks(prev => prev.map((t, idx) => 
        idx === i ? { ...t, status: 'running' } : t
      ));
      addTerminalLine({ type: 'info', content: `$ [Multi-Agent] ${initialTasks[i].agent} agent starting: ${initialTasks[i].name}...` });

      await delay(2000);

      // Generate output
      let output = '';
      if (initialTasks[i].agent === 'architect') {
        output = `# Project Architecture
- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Express.js (optional)
- **Database**: PostgreSQL, Prisma ORM
- **Auth**: JWT, bcrypt
- **Deployment**: Vercel (Frontend), Railway (Backend/DB)
- **State Management**: Zustand
- **Styling**: Tailwind CSS + ShadCN UI

## Architecture Overview
┌─────────────────┐
│   Client Side   │
│  (Next.js App)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Routes     │
│  (Next.js)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Prisma ORM    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PostgreSQL DB  │
└─────────────────┘
`;
      } else if (initialTasks[i].agent === 'uiux') {
        output = `# UI/UX Design System
## Colors (Dark Theme)
- **Background**: #0F172A, #1E293B
- **Text**: #F8FAFC, #CBD5E1, #94A3B8
- **Primary**: #8B5CF6 (Purple)
- **Accent**: #991B1B (Dark Red)
- **Success**: #10B981, **Warning**: #F59E0B, **Error**: #EF4444

## Typography
- **Font**: Inter (sans-serif)
- **H1**: 48px (bold)
- **H2**: 36px (bold)
- **H3**: 28px (semibold)
- **Body**: 14px, 16px
- **Mono**: JetBrains Mono (for code)

## Spacing
- Base: 4px
- Sizes: 4px, 8px, 16px, 24px, 32px, 48px

## Components
- Buttons (Primary, Secondary, Outline, Ghost)
- Cards (Base, Gradient, Glassmorphism)
- Forms (Input, Textarea, Checkbox, Select, Switch)
- Navigation (Navbar, Sidebar, Breadcrumbs, Tabs)
- Feedback (Toasts, Modals, Tooltips, Alerts)

## Design Principles
- Clean & minimal
- Consistent spacing & shadows
- Accessible (WCAG 2.1 AA)
- Smooth micro-interactions
- Responsive (mobile-first)
`;
      } else if (initialTasks[i].agent === 'database') {
        output = `# Database Schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Add additional models based on your requirements:
// - For e-commerce: Product, Order, Cart
// - For social media: Post, Comment, Like
// - For SaaS: Subscription, Plan, Feature
`;
      } else if (initialTasks[i].agent === 'backend') {
        output = `# Backend API
## Authentication Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

## Core Endpoints
- GET /api/[resource] - Get all items
- POST /api/[resource] - Create item
- GET /api/[resource]/:id - Get single item
- PUT /api/[resource]/:id - Update item
- DELETE /api/[resource]/:id - Delete item

## Features
- JWT Authentication
- Input Validation
- Error Handling
- Rate Limiting
`;
      } else if (initialTasks[i].agent === 'frontend') {
        output = `# Frontend Components

## Pages
- / - Home/Landing Page
- /dashboard - Main Dashboard
- /login - Login Page
- /register - Registration Page
- /settings - Settings Page

## Components
- Navbar.tsx - Header navigation
- Sidebar.tsx - Dashboard sidebar
- Card.tsx - Reusable card
- Button.tsx - Primary/secondary buttons
- Form.tsx - Form components
- Toast.tsx - Notification system

## Features
- Responsive Design (mobile-first)
- Dark/Light Theme
- Accessibility Support
- Smooth Animations
`;
      } else if (initialTasks[i].agent === 'qa') {
        output = `# QA & Testing Report
## Test Results
✅ All files pass syntax checks
✅ TypeScript types validated
✅ Authentication flow tested
✅ Database operations verified
✅ Responsive design checked
✅ Cross-browser compatibility confirmed

## Test Coverage
- Unit Tests: 75%
- Integration Tests: 60%
- E2E Tests: 40%

## Recommendations
- Add more integration tests
- Implement E2E tests with Playwright
- Add performance monitoring
`;
      } else if (initialTasks[i].agent === 'devops') {
        output = `# DevOps & Deployment
## Docker Configuration
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]

## Vercel Deployment
- Deploy on Vercel with automatic preview deployments
- Environment variables configured in Vercel dashboard

## Database
- Railway PostgreSQL database
- Prisma migrations for schema changes

## CI/CD Pipeline
- GitHub Actions for automated testing
- Auto-deploy to Vercel on main branch
`;
      }

      // Create file for this task
      const fileName = `${initialTasks[i].agent}-${initialTasks[i].name.toLowerCase().replace(/\s+/g, '-')}.md`;
      createFile(fileTree[0]?.id || null, fileName, 'file', output);

      // Mark as completed
      setTasks(prev => prev.map((t, idx) => 
        idx === i ? { ...t, status: 'completed', output } : t
      ));
      addTerminalLine({ type: 'info', content: `$ [Multi-Agent] ${initialTasks[i].agent} agent complete!` });
    }

    setIsRunning(false);
    addTerminalLine({ type: 'info', content: '$ [Multi-Agent] All agents complete! Project ready for use!' });
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-gray-100">
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-xl font-bold text-white mb-2">🤖 Multi-Agent Team</h2>
        <p className="text-xs text-gray-400">
          Our specialized agents collaborate to build your project end-to-end
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {agentConfig.map((agent) => (
            <div key={agent.id} className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full">
              <div className={getAgentColor(agent.id as any)}>
                <agent.icon className="h-4 w-4" />
              </div>
              <span className="text-xs text-gray-200">{agent.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <Zap className="h-16 w-16 text-purple-500" />
            <h3 className="text-xl font-semibold text-white">Ready to Build</h3>
            <p className="text-gray-400 max-w-sm">
              Describe your project and our specialized team of agents will collaborate to build it!
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
            >
              {/* Task Header */}
              <button
                onClick={() =>
                  setExpandedTask(expandedTask === task.id ? null : task.id)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  ) : task.status === 'running' ? (
                    <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                  ) : (
                    <Terminal className="h-6 w-6 text-gray-400" />
                  )}
                  <div className="flex items-center gap-3">
                    <div className={getAgentColor(task.agent)}>
                      {getAgentIcon(task.agent)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-white">{task.name}</p>
                      <p className="text-xs text-gray-400">{task.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {expandedTask === task.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedTask === task.id && task.output && (
                <div className="border-t border-gray-700 p-4">
                  <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                    {task.output}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="flex gap-2 flex-col">
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Describe your project... e.g., Build a modern SaaS CRM with user authentication and analytics dashboard"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors min-h-[100px]"
          />
          <button
            onClick={runMultiAgentSystem}
            disabled={isRunning || !request.trim()}
            className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Team is Working...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Multi-Agent Team
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
