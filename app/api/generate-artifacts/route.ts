import { NextRequest, NextResponse } from 'next/server';

const MODEL_PROVIDER_MAP: Record<string, { provider: string; model: string }> = {
  'gpt-4': { provider: 'openai', model: 'gpt-4' },
  'gpt-4o': { provider: 'openai', model: 'gpt-4o' },
  'gpt-4-turbo': { provider: 'openai', model: 'gpt-4-turbo' },
  'claude-3-opus': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'claude-3-sonnet': { provider: 'anthropic', model: 'claude-3-sonnet-20240229' },
  'gemini-1.5-pro': { provider: 'google', model: 'gemini-1.5-pro' },
  'deepseek-v3': { provider: 'deepseek', model: 'deepseek-chat' },
};

// Mock responses for when API keys are not available
const getMockArtifactContent = (artifactType: string, description: string) => {
  switch (artifactType) {
    case 'architecture':
      return `# Project Architecture: ${description}

## High-Level Overview
A modern full-stack application built with Next.js 15, providing a seamless user experience.

## Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Deployment**: Vercel/Netlify

## Key Layers
1. Presentation Layer (Next.js Pages/Components)
2. API Layer (Next.js API Routes)
3. Business Logic Layer
4. Data Access Layer (Prisma)
5. Database Layer`;
    case 'databaseSchema':
      return `# Database Schema: ${description}

\`\`\`prisma
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
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
\`\`\``;
    case 'folderStructure':
      return `# Folder Structure: ${description}

\`\`\`
samai/
├── app/
│   ├── api/
│   │   └── auth/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── public/
├── package.json
└── middleware.ts
\`\`\``;
    case 'apiRoutes':
      return `# API Routes: ${description}

## Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user`;
    case 'uiPages':
      return `# UI Pages: ${description}

## Pages
- / - Landing page
- /login - Login page
- /register - Registration page
- /dashboard - Dashboard (protected)`;
    case 'components':
      return `# Components: ${description}

\`\`\`jsx
export function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button onClick={onClick} className="px-4 py-2 rounded-lg">
      {children}
    </button>
  );
}
\`\`\``;
    case 'deploymentPlan':
      return `# Deployment Plan: ${description}

## Steps
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy! 🚀`;
    default:
      return `# ${artifactType}`;
  }
};

async function callLLM(messages: { role: string; content: string }[], model: string = 'gpt-4o') {
  const modelConfig = MODEL_PROVIDER_MAP[model];
  if (!modelConfig) throw new Error('Unsupported model');

  let response;

  try {
    if (modelConfig.provider === 'openai' || modelConfig.provider === 'deepseek') {
      const apiKey = modelConfig.provider === 'deepseek' ? process.env.DEEPSEEK_API_KEY : process.env.OPENAI_API_KEY;
      const baseUrl = modelConfig.provider === 'deepseek' ? 'https://api.deepseek.com/v1' : 'https://api.openai.com/v1';

      if (!apiKey) throw new Error('API key not configured');

      response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelConfig.model,
          messages,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'API request failed');
      return data.choices[0].message.content;
    } else if (modelConfig.provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('API key not configured');

      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelConfig.model,
          messages: messages.map((m) => ({ role: m.role as any, content: m.content })),
          max_tokens: 4096,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'API request failed');
      return data.content[0].text;
    } else if (modelConfig.provider === 'google') {
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) throw new Error('API key not configured');

      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelConfig.model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: messages.map((m) => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }],
            })),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'API request failed');
      return data.candidates[0].content.parts[0].text;
    }
  } catch {
    // If API call fails, return null to use mock data
    return null;
  }

  throw new Error('Unsupported provider');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, artifactType } = body;

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (artifactType) {
      case 'architecture':
        systemPrompt = 'You are a senior software architect. Generate a detailed project architecture document for a full-stack application. Include tech stack, layers, and key components.';
        userPrompt = `Generate a detailed project architecture for the following application: "${description}". Include: High-Level Overview, Tech Stack (Frontend, Backend, Database, Deployment), Key Layers, and Components. Use markdown format.`;
        break;
      case 'databaseSchema':
        systemPrompt = 'You are a database designer. Generate a Prisma schema for a full-stack application. Include User model and relevant models based on the application type.';
        userPrompt = `Generate a Prisma schema for the following application: "${description}". Include User model and all other necessary models with proper relations. Use Prisma syntax and wrap it in a code block.`;
        break;
      case 'folderStructure':
        systemPrompt = 'You are a full-stack developer. Generate a detailed folder structure for a Next.js 15 application.';
        userPrompt = `Generate a detailed folder structure for a Next.js 15 application for: "${description}". Include all necessary directories and files. Use a tree-like format in markdown.`;
        break;
      case 'apiRoutes':
        systemPrompt = 'You are a backend developer. Generate REST API endpoints documentation for a Next.js API routes application.';
        userPrompt = `Generate REST API endpoints documentation for the following application: "${description}". Include authentication endpoints and all resource endpoints. Use markdown format.`;
        break;
      case 'uiPages':
        systemPrompt = 'You are a frontend developer. Generate UI pages and components documentation for a Next.js 15 application with Tailwind CSS.';
        userPrompt = `Generate UI pages and components documentation for the following application: "${description}". Include all main pages and key components. Use markdown format.`;
        break;
      case 'components':
        systemPrompt = 'You are a React component library developer. Generate example components for a Next.js 15 application with Tailwind CSS.';
        userPrompt = `Generate example React components (Button, Card, Form, etc.) for the following application: "${description}". Use JSX syntax and Tailwind CSS classes. Include code examples.`;
        break;
      case 'deploymentPlan':
        systemPrompt = 'You are a DevOps engineer. Generate a step-by-step deployment plan for a full-stack application.';
        userPrompt = `Generate a step-by-step deployment plan for the following application: "${description}". Include prerequisites, cloud providers, CI/CD, and post-deployment checks. Use markdown format.`;
        break;
      default:
        throw new Error('Invalid artifact type');
    }

    // Try LLM first, fall back to mock
    let content = await callLLM([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    if (!content) {
      content = getMockArtifactContent(artifactType, description);
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Generate artifacts error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate artifacts' },
      { status: 500 }
    );
  }
}
