'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Zap,
  Cog,
  Server,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  Rocket,
  FileCode,
  ExternalLink,
  Globe,
} from 'lucide-react';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface DeploymentConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  filename: string;
  content: string;
}

interface DeploymentPlatform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  endpoint: string;
  config: DeploymentConfig;
}

const deploymentConfigs: DeploymentConfig[] = [
  {
    id: 'docker',
    name: 'Dockerfile',
    icon: Server,
    filename: 'Dockerfile',
    content: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
`,
  },
  {
    id: 'docker-compose',
    name: 'Docker Compose',
    icon: Cog,
    filename: 'docker-compose.yml',
    content: `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
volumes:
  postgres_data:
`,
  },
  {
    id: 'dockerignore',
    name: '.dockerignore',
    icon: FileCode,
    filename: '.dockerignore',
    content: `node_modules
.next
.git
.gitignore
README.md
.env
.env.local
.env.*.local
`,
  },
  {
    id: 'vercel',
    name: 'Vercel Config',
    icon: Rocket,
    filename: 'vercel.json',
    content: `{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/" }
  ]
}
`,
  },
  {
    id: 'netlify',
    name: 'Netlify Config',
    icon: Globe,
    filename: 'netlify.toml',
    content: `[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`,
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages Config',
    icon: Globe,
    filename: 'wrangler.toml',
    content: `name = "samai-app"
compatibility_date = "2024-01-01"

[build]
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`,
  },
  {
    id: 'nginx',
    name: 'Nginx Config',
    icon: Server,
    filename: 'nginx.conf',
    content: `server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
  }
}
`,
  },
  {
    id: 'ci-cd',
    name: 'CI/CD Workflow',
    icon: GitBranch,
    filename: '.github/workflows/deploy.yml',
    content: `name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
`,
  },
];

const platforms: DeploymentPlatform[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    icon: Rocket,
    color: 'text-white',
    bgColor: 'bg-black hover:bg-gray-900',
    endpoint: '/api/deploy/vercel',
    config: deploymentConfigs.find(c => c.id === 'vercel')!
  },
  {
    id: 'netlify',
    name: 'Netlify',
    icon: Globe,
    color: 'text-white',
    bgColor: 'bg-[#00AD9F] hover:bg-[#009688]',
    endpoint: '/api/deploy/netlify',
    config: deploymentConfigs.find(c => c.id === 'netlify')!
  },
  {
    id: 'railway',
    name: 'Railway',
    icon: Rocket,
    color: 'text-white',
    bgColor: 'bg-[#0B0D0E] hover:bg-[#1A1D1E]',
    endpoint: '/api/deploy/railway',
    config: deploymentConfigs.find(c => c.id === 'docker')!
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages',
    icon: Globe,
    color: 'text-white',
    bgColor: 'bg-[#F38020] hover:bg-[#E67510]',
    endpoint: '/api/deploy/cloudflare',
    config: deploymentConfigs.find(c => c.id === 'cloudflare')!
  },
];

export function DeploymentAgent() {
  const {
    addTerminalLine,
    createFile,
    fileTree,
  } = useAppStore();

  const [generatingConfig, setGeneratingConfig] = useState<string | null>(null);
  const [generatedConfigs, setGeneratedConfigs] = useState<string[]>([]);
  const [deployingPlatform, setDeployingPlatform] = useState<string | null>(null);
  const [deployments, setDeployments] = useState<Record<string, { url: string; success: boolean }>>({});

  const generateConfig = async (config: DeploymentConfig) => {
    setGeneratingConfig(config.id);
    addTerminalLine({ type: 'info', content: `$ [Deploy] Generating ${config.name}...` });

    await delay(1000);

    createFile(fileTree[0]?.id || null, config.filename, 'file', config.content);
    setGeneratedConfigs(prev => [...prev, config.id]);

    addTerminalLine({ type: 'info', content: `$ [Deploy] ${config.name} created!` });
    setGeneratingConfig(null);
  };

  const generateAll = async () => {
    for (const config of deploymentConfigs) {
      await generateConfig(config);
    }
  };

  // Helper to flatten file tree
  const flattenFileTree = (nodes: any[]): any[] => {
    const files: any[] = [];
    const traverse = (items: any[]) => {
      for (const node of items) {
        if (node.type === 'file' && node.content) {
          files.push({ name: node.name, content: node.content, path: node.path });
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    };
    traverse(nodes);
    return files;
  };

  const deployToPlatform = async (platform: DeploymentPlatform) => {
    setDeployingPlatform(platform.id);
    addTerminalLine({ type: 'info', content: `$ [Deploy] Starting deployment to ${platform.name}...` });

    try {
      // Generate platform config first
      if (!generatedConfigs.includes(platform.config.id)) {
        await generateConfig(platform.config);
      }

      // Collect all files from file tree and store in sessionStorage
      const files = flattenFileTree(fileTree);
      sessionStorage.setItem('sam-ai-deployed-files', JSON.stringify(files));

      // Call deployment API
      const response = await fetch(platform.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result.success) {
        addTerminalLine({ type: 'info', content: `$ [Deploy] Deployment successful!` });
        addTerminalLine({ type: 'info', content: `$ [Deploy] Public URL: ${result.publicUrl}` });
        setDeployments(prev => ({
          ...prev,
          [platform.id]: { url: result.publicUrl, success: true }
        }));
      } else {
        addTerminalLine({ type: 'error', content: `$ [Deploy] Deployment failed: ${result.error}` });
        setDeployments(prev => ({
          ...prev,
          [platform.id]: { url: '', success: false }
        }));
      }
    } catch (error) {
      addTerminalLine({ type: 'error', content: `$ [Deploy] Deployment failed: ${error}` });
    } finally {
      setDeployingPlatform(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Deployment Platforms Section */}
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="h-7 w-7 text-purple-500" />
          <div>
            <h2 className="text-2xl font-bold text-white">One-Click Deployment</h2>
            <p className="text-gray-400 text-sm">Deploy your app to Vercel, Netlify, Railway, or Cloudflare</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-purple-500 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-700">
                    <platform.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{platform.name}</h3>
                    <p className="text-xs text-gray-400">Deploy with one click</p>
                  </div>
                </div>
              </div>

              {deployments[platform.id]?.success ? (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Deployed!</span>
                  </div>
                  <a
                    href={deployments[platform.id].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <Globe className="h-4 w-4" />
                    {deployments[platform.id].url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <button
                  onClick={() => deployToPlatform(platform)}
                  disabled={!!deployingPlatform || !!generatingConfig}
                  className={`w-full ${platform.bgColor} ${platform.color} disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors`}
                >
                  {deployingPlatform === platform.id ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Deploy to {platform.name}
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Configuration Files Section */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <FileCode className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-bold text-white">Deployment Configurations</h3>
          </div>

          <button
            onClick={generateAll}
            disabled={!!generatingConfig || !!deployingPlatform}
            className="w-full mb-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
          >
            {generatingConfig ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating All Configs...
              </>
            ) : (
              'Generate All Deployment Configs'
            )}
          </button>

          <div className="grid grid-cols-1 gap-4">
            {deploymentConfigs.map((config) => (
              <div
                key={config.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-purple-500 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-700">
                      <config.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{config.name}</h3>
                      <p className="text-xs text-gray-400">{config.filename}</p>
                    </div>
                  </div>

                  {generatedConfigs.includes(config.id) ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm">Created</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => generateConfig(config)}
                      disabled={!!generatingConfig || !!deployingPlatform}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      {generatingConfig === config.id ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate'
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
