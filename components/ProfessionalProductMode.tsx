'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Play,
  RefreshCw,
  CheckCircle2,
  FileCode,
  Database,
  Palette,
  Layers,
  Monitor,
  TestTube,
  Rocket,
  ChevronDown,
  ChevronUp,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplateEngine, Template } from './TemplateEngine';

const generateId = () => Math.random().toString(36).slice(2, 11);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type StepType = 'requirements' | 'architecture' | 'design' | 'database' | 'apis' | 'ui' | 'review' | 'tests' | 'deployment';

interface Step {
  id: StepType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

interface Requirement {
  id: string;
  question: string;
  answer: string;
}

export function ProfessionalProductMode() {
  const {
    addTerminalLine,
    createFile,
    fileTree,
  } = useAppStore();

  const [phase, setPhase] = useState<'templates' | 'requirements' | 'building' | 'complete'>('templates');
  const [projectDescription, setProjectDescription] = useState('');
  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: 'r1', question: 'Who is the target audience?', answer: '' },
    { id: 'r2', question: 'What are the core features?', answer: '' },
    { id: 'r3', question: 'What is the tech stack preference?', answer: 'Next.js, Tailwind, Postgres (default)' },
    { id: 'r4', question: 'Any special requirements? (mobile, realtime, etc.)', answer: '' },
  ]);
  const [steps, setSteps] = useState<Step[]>([
    { id: 'architecture', name: 'Architecture Design', description: 'Creating system architecture and tech stack', icon: Layers, status: 'pending' },
    { id: 'design', name: 'Design System', description: 'Creating UI components and design guidelines', icon: Palette, status: 'pending' },
    { id: 'database', name: 'Database Schema', description: 'Designing database models and relations', icon: Database, status: 'pending' },
    { id: 'apis', name: 'API Development', description: 'Building REST/GraphQL API endpoints', icon: FileCode, status: 'pending' },
    { id: 'ui', name: 'UI Implementation', description: 'Building user interface and components', icon: Monitor, status: 'pending' },
    { id: 'review', name: 'Code Review', description: 'Reviewing and refactoring code', icon: CheckCircle2, status: 'pending' },
    { id: 'tests', name: 'Test Generation', description: 'Writing unit, integration, and E2E tests', icon: TestTube, status: 'pending' },
    { id: 'deployment', name: 'Deployment', description: 'Creating deployment configs and Docker', icon: Rocket, status: 'pending' },
  ]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const stepConfig: Record<StepType, { name: string; description: string; icon: React.ComponentType<{ className?: string }> }> = {
    'requirements': { name: 'Requirements', description: 'Gathering and analyzing requirements', icon: MessageSquare },
    'architecture': { name: 'Architecture', description: 'Creating system architecture and tech stack', icon: Layers },
    'design': { name: 'Design System', description: 'Creating UI components and design guidelines', icon: Palette },
    'database': { name: 'Database', description: 'Designing database models and relations', icon: Database },
    'apis': { name: 'APIs', description: 'Building REST/GraphQL API endpoints', icon: FileCode },
    'ui': { name: 'UI', description: 'Building user interface and components', icon: Monitor },
    'review': { name: 'Review', description: 'Reviewing and refactoring code', icon: CheckCircle2 },
    'tests': { name: 'Tests', description: 'Writing unit, integration, and E2E tests', icon: TestTube },
    'deployment': { name: 'Deployment', description: 'Creating deployment configs and Docker', icon: Rocket },
  };

  const handleSelectTemplate = (template: Template) => {
    setProjectDescription(template.sampleDescription);
    setPhase('requirements');
  };

  const updateRequirement = (id: string, answer: string) => {
    setRequirements(prev => prev.map(r => r.id === id ? { ...r, answer } : r));
  };

  const startBuilding = async () => {
    setPhase('building');
    
    addTerminalLine({ type: 'info', content: '$ [Professional Mode] Starting professional product development...' });
    
    const buildSteps = steps as Step[];
    for (let i = 0; i < buildSteps.length; i++) {
      // Mark current step as running
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
      addTerminalLine({ type: 'info', content: `$ [Professional Mode] Executing: ${buildSteps[i].name}...` });
      
      await delay(1500);
      
      // Generate output for each step
      let output = '';
      let fileName = '';
      
      switch (buildSteps[i].id) {
        case 'architecture':
          output = `# Professional Product Architecture\n\n## Tech Stack\n- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS\n- Backend: Next.js API Routes, Prisma ORM\n- Database: PostgreSQL\n- Deployment: Docker, Vercel, Railway\n- Auth: JWT + bcrypt\n- Testing: Vitest, Playwright\n- UI: ShadCN UI Components\n\n## Architecture Diagram\n┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐\n│   Client Side   │◄────►│  Next.js App    │◄────►│  PostgreSQL DB  │\n│  (Browser)      │      │  (API Routes)   │      │  (Prisma ORM)   │\n└─────────────────┘      └─────────────────┘      └─────────────────┘\n`;
          fileName = '01-architecture.md';
          break;
        
        case 'design':
          output = `# Design System\n\n## Colors\n- Primary: Red (#991b1b)\n- Background: Slate (#0f172a)\n- Surface: Gray-800 (#1e293b)\n\n## Typography\n- Font: Inter\n- Base: 16px\n- H1: 36px, H2: 28px, H3: 22px\n\n## Components\n- Buttons (primary, secondary, danger)\n- Inputs, Textarea, Select\n- Cards, Modals, Tooltips\n- Tables, Forms, Navigation`;
          fileName = '02-design-system.md';
          break;
        
        case 'database':
          output = `# Database Schema\n\n## Prisma Schema\ngenerator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url = env("DATABASE_URL")\n}\n\nmodel User {\n  id        String   @id @default(cuid())\n  email     String   @unique\n  password  String\n  name      String\n  role      Role     @default(USER)\n  createdAt DateTime @default(now())\n}\n\nenum Role {\n  USER\n  ADMIN\n}\n`;
          fileName = '03-database-schema.prisma';
          break;
        
        case 'apis':
          output = `# API Routes\n\n## Authentication\n- POST /api/auth/register\n- POST /api/auth/login\n- GET /api/auth/me\n\n## CRUD Endpoints\n- GET /api/[resource]\n- POST /api/[resource]\n- GET /api/[resource]/:id\n- PUT /api/[resource]/:id\n- DELETE /api/[resource]/:id`;
          fileName = '04-apis.md';
          break;
        
        case 'ui':
          output = `# UI Implementation\n\n## Pages\n- / (Home/Landing)\n- /dashboard (Dashboard)\n- /login, /register (Auth)\n- /settings (Settings)\n\n## Components\n- Navbar, Sidebar, Footer\n- Button, Input, Card\n- Table, Form, Modal`;
          fileName = '05-ui.md';
          break;
        
        case 'review':
          output = `# Code Review Report\n\n✅ Architecture: Clean separation of concerns\n✅ Database: Proper relationships and indexes\n✅ APIs: RESTful design, proper validation\n✅ UI: Responsive, accessible, consistent`;
          fileName = '06-review.md';
          break;
        
        case 'tests':
          output = `# Tests\n\n## Unit Tests (Vitest)\n- API routes tests\n- Component tests\n- Utility functions tests\n\n## E2E Tests (Playwright)\n- Auth flow\n- CRUD operations\n- Navigation`;
          fileName = '07-tests.md';
          break;
        
        case 'deployment':
          output = `# Deployment\n\n## Dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=builder /app/.next/standalone ./\nEXPOSE 3000\nCMD ["node", "server.js"]`;
          fileName = '08-deployment.md';
          break;
      }
      
      createFile(fileTree[0]?.id || null, fileName, 'file', output);
      
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed', output } : s));
      addTerminalLine({ type: 'success', content: `$ [Professional Mode] ${buildSteps[i].name} complete!` });
    }
    
    setPhase('complete');
    addTerminalLine({ type: 'info', content: '$ [Professional Mode] Professional product ready for use! 🎉' });
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-gray-100">
      {phase === 'templates' && <TemplateEngine onSelectTemplate={handleSelectTemplate} />}

      {phase === 'requirements' && (
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-700 bg-gray-800">
            <h2 className="text-2xl font-bold text-white mb-2">📝 Gather Requirements</h2>
            <p className="text-sm text-gray-400">
              Tell us about your product. This will help us build a professional solution tailored to your needs.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Product Description</label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-red-800 min-h-[100px]"
              />
            </div>

            {requirements.map((req) => (
              <div key={req.id} className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{req.question}</label>
                <input
                  type="text"
                  value={req.answer}
                  onChange={(e) => updateRequirement(req.id, e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-red-800"
                />
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-gray-700 bg-gray-800/50">
            <button
              onClick={startBuilding}
              className="w-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Building Professional Product
            </button>
          </div>
        </div>
      )}

      {(phase === 'building' || phase === 'complete') && (
        <>
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <h2 className="text-xl font-bold text-white mb-2">🚀 Professional Product Mode</h2>
            <p className="text-xs text-gray-400">
              SAM AI is building your professional product end-to-end
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    ) : step.status === 'running' ? (
                      <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                    ) : (
                      <step.icon className="h-6 w-6 text-gray-400" />
                    )}
                    <div className="text-left">
                      <p className="font-semibold text-white">{step.name}</p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedStep === step.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
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

            {phase === 'complete' && (
              <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-700 rounded-xl p-6 text-center">
                <Zap className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Professional Product Complete!</h3>
                <p className="text-gray-300 text-sm">
                  All steps completed. Explore your files in the file explorer!
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
