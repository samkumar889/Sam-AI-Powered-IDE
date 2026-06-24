
'use client';

import React, { useState } from 'react';
import { Sparkles, Code, Database, Globe, Palette, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

type ProjectTemplate = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  techStack: string[];
  files: { name: string; path: string; content: string }[];
};

const TEMPLATES: ProjectTemplate[] = [
  {
    id: 'crm',
    name: 'CRM System',
    description: 'Customer Relationship Management with lead tracking, deals, and contacts',
    icon: <Code className="w-8 h-8 text-blue-500" />,
    techStack: ['React', 'Next.js', 'Prisma', 'PostgreSQL', 'Tailwind'],
    files: [
      {
        name: 'dashboard/page.tsx',
        path: 'app/dashboard/page.tsx',
        content: `export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">CRM Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white">
          <h3 className="text-3xl font-bold">245</h3>
          <p className="text-sm opacity-90">Total Leads</p>
        </div>
        <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white">
          <h3 className="text-3xl font-bold">89</h3>
          <p className="text-sm opacity-90">Deals Won</p>
        </div>
        <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white">
          <h3 className="text-3xl font-bold">1.2M</h3>
          <p className="text-sm opacity-90">Pipeline Value</p>
        </div>
      </div>
    </div>
  );
}`
      },
      {
        name: 'schema.prisma',
        path: 'prisma/schema.prisma',
        content: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Contact {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  phone     String?
  company   String?
  createdAt DateTime @default(now())
  deals     Deal[]
}

model Deal {
  id        Int      @id @default(autoincrement())
  name      String
  value     Float
  stage     String
  contact   Contact  @relation(fields: [contactId], references: [id])
  contactId Int
  createdAt DateTime @default(now())
}`
      },
      {
        name: 'page.tsx',
        path: 'app/page.tsx',
        content: `import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
          Welcome to your CRM
        </h1>
        <p className="text-xl text-gray-600 mb-10 text-center">
          Manage your leads, deals, and customers all in one place
        </p>
        <div className="flex justify-center">
          <Link 
            href="/dashboard" 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}`
      }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Platform',
    description: 'Full-featured online store with products, cart, and checkout',
    icon: <Globe className="w-8 h-8 text-orange-500" />,
    techStack: ['React', 'Next.js', 'Stripe', 'Tailwind', 'MongoDB'],
    files: [
      {
        name: 'page.tsx',
        path: 'app/page.tsx',
        content: `export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
          Welcome to our Store!
        </h1>
        <p className="text-xl text-gray-600 mb-10 text-center">
          Discover amazing products at great prices
        </p>
      </div>
    </div>
  );
}`
      }
    ]
  },
  {
    id: 'saas',
    name: 'SaaS Platform',
    description: 'Software as a Service with subscription billing and user management',
    icon: <Zap className="w-8 h-8 text-purple-500" />,
    techStack: ['React', 'Next.js', 'Stripe', 'Supabase', 'Tailwind'],
    files: [
      {
        name: 'page.tsx',
        path: 'app/page.tsx',
        content: `export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
          SaaS Platform Ready!
        </h1>
        <p className="text-xl text-gray-600 mb-10 text-center">
          Scale your business with our powerful platform
        </p>
      </div>
    </div>
  );
}`
      }
    ]
  },
  {
    id: 'lms',
    name: 'Learning Management System',
    description: 'Educational platform with courses, lessons, and progress tracking',
    icon: <Database className="w-8 h-8 text-green-500" />,
    techStack: ['React', 'Next.js', 'Prisma', 'Tailwind', 'Redis'],
    files: [
      {
        name: 'page.tsx',
        path: 'app/page.tsx',
        content: `export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
          Welcome to LMS!
        </h1>
        <p className="text-xl text-gray-600 mb-10 text-center">
          Start learning amazing courses today
        </p>
      </div>
    </div>
  );
}`
      }
    ]
  },
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    description: 'Beautiful personal portfolio with projects and blog',
    icon: <Palette className="w-8 h-8 text-pink-500" />,
    techStack: ['React', 'Next.js', 'Tailwind', 'MDX'],
    files: [
      {
        name: 'page.tsx',
        path: 'app/page.tsx',
        content: `export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
          Hello, I'm a Developer!
        </h1>
        <p className="text-xl text-gray-600 mb-10 text-center">
          Check out my amazing projects and work
        </p>
      </div>
    </div>
  );
}`
      }
    ]
  }
];

export default function ProjectGeneratorPanel() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const { createFile } = useAppStore();

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create files
    selectedTemplate.files.forEach(file => {
      const pathParts = file.path.split('/');
      createFile(null, pathParts[pathParts.length - 1], 'file', file.content);
    });
    
    setIsGenerating(false);
    setGenerationComplete(true);
  };

  return (
    <div className="flex flex-col h-full p-6 bg-gray-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-yellow-400" />
          AI Project Generator
        </h2>
        <p className="text-gray-400 mt-2">
          Generate a complete project from a template or description
        </p>
      </div>

      {!selectedTemplate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-6">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className="p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:border-emerald-500 hover:bg-gray-750 cursor-pointer transition-all"
            >
              <div className="mb-4">{template.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{template.description}</p>
              <div className="flex flex-wrap gap-2">
                {template.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-700 rounded-xl">{selectedTemplate.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedTemplate.name}</h3>
                  <p className="text-gray-400">{selectedTemplate.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedTemplate.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Files to generate:</h4>
              <div className="space-y-2">
                {selectedTemplate.files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                    <Code className="w-4 h-4 text-emerald-400" />
                    {file.path}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {generationComplete ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-800 border border-emerald-600 rounded-2xl">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Project Generated!</h3>
              <p className="text-gray-400 text-center max-w-md">
                Your {selectedTemplate.name} has been created successfully! Check the file explorer.
              </p>
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setGenerationComplete(false);
                }}
                className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
              >
                Generate Another
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">⚡</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Project
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
