'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Play,
  RefreshCw,
  CheckCircle2,
  FileCode,
  Database,
  FolderOpen,
  Globe,
  Layers,
  Server,
  Zap,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplateEngine, TEMPLATES, Template } from './TemplateEngine';

const generateId = () => Math.random().toString(36).slice(2, 11);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ProjectArtifact {
  id: string;
  type: 'architecture' | 'folderStructure' | 'databaseSchema' | 'apiRoutes' | 'uiPages' | 'components' | 'deploymentPlan';
  title: string;
  content: string;
  status: 'pending' | 'generating' | 'completed';
}

interface CodeFile {
  id: string;
  path: string;
  type: string;
  content: string;
  status: 'pending' | 'generating' | 'completed';
}

const artifactDefinitions = [
  { type: 'architecture', id: 'arch', title: 'Project Architecture' },
  { type: 'folderStructure', id: 'folder', title: 'Folder Structure' },
  { type: 'databaseSchema', id: 'db', title: 'Database Schema' },
  { type: 'apiRoutes', id: 'api', title: 'API Routes' },
  { type: 'uiPages', id: 'ui', title: 'UI Pages' },
  { type: 'components', id: 'components', title: 'Components' },
  { type: 'deploymentPlan', id: 'deploy', title: 'Deployment Plan' },
];

const codeFilesDefinitions = [
  { id: 'packageJson', path: 'package.json', type: 'packageJson' },
  { id: 'prismaSchema', path: 'prisma/schema.prisma', type: 'prismaSchema' },
  { id: 'libPrisma', path: 'lib/prisma.ts', type: 'libPrisma' },
  { id: 'middleware', path: 'middleware.ts', type: 'middleware' },
  { id: 'authRegister', path: 'app/api/auth/register/route.ts', type: 'authRouteRegister' },
  { id: 'authLogin', path: 'app/api/auth/login/route.ts', type: 'authRouteLogin' },
  { id: 'authMe', path: 'app/api/auth/me/route.ts', type: 'authRouteMe' },
  { id: 'layout', path: 'app/layout.tsx', type: 'layout' },
  { id: 'loginPage', path: 'app/login/page.tsx', type: 'loginPage' },
  { id: 'registerPage', path: 'app/register/page.tsx', type: 'registerPage' },
  { id: 'dashboardPage', path: 'app/dashboard/page.tsx', type: 'dashboardPage' },
];

const generateArtifact = async (description: string, type: ProjectArtifact['type']) => {
  try {
    const response = await fetch('/api/generate-artifacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, artifactType: type }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate artifact');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error generating artifact:', error);
    return `# ${type.replace(/([A-Z])/g, ' $1').trim()}

Failed to generate content. Error: ${error instanceof Error ? error.message : 'Unknown error'}
`;
  }
};

const generateCode = async (description: string, type: string) => {
  try {
    const response = await fetch('/api/generate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, fileType: type }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate code');
    }

    const data = await response.json();
    return data.code;
  } catch (error) {
    console.error('Error generating code:', error);
    return `// Failed to generate code
// Error: ${error instanceof Error ? error.message : 'Unknown error'}
`;
  }
};

const reviewCode = async (code: string, filePath: string, description: string) => {
  try {
    const response = await fetch('/api/review-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, filePath, description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to review code');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error reviewing code:', error);
    return {
      review: ['Review process failed'],
      refactoredCode: code,
      improvements: ['Code preserved as-is'],
    };
  }
};

export function ProjectGeneratorAgent() {
  const {
    addTerminalLine,
    createFile,
    fileTree,
  } = useAppStore();

  const [mode, setMode] = useState<'templates' | 'custom' | 'generating'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [description, setDescription] = useState('');
  const [artifacts, setArtifacts] = useState<ProjectArtifact[]>([]);
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [expandedArtifact, setExpandedArtifact] = useState<string | null>(null);
  const [expandedCodeFile, setExpandedCodeFile] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'docs' | 'code'>('docs');

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setDescription(template.sampleDescription);
    setMode('custom');
  };

  const getIconForArtifact = (type: ProjectArtifact['type']) => {
    switch (type) {
      case 'architecture':
        return <Layers className="h-4 w-4" />;
      case 'folderStructure':
        return <FolderOpen className="h-4 w-4" />;
      case 'databaseSchema':
        return <Database className="h-4 w-4" />;
      case 'apiRoutes':
        return <Server className="h-4 w-4" />;
      case 'uiPages':
      case 'components':
        return <Globe className="h-4 w-4" />;
      case 'deploymentPlan':
        return <Zap className="h-4 w-4" />;
    }
  };

  const createDirectoryPath = async (path: string) => {
    const parts = path.split('/');
    let currentParentId = fileTree[0]?.id || null;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const dirName = parts[i];
      if (!dirName) continue;
      
      // Check if directory exists
      const existingDir = fileTree.find((f) => f.name === dirName && f.type === 'folder');
      if (existingDir) {
        currentParentId = existingDir.id;
      } else {
        // Create directory
        createFile(currentParentId, dirName, 'folder', '');
        // We'll need to wait for the store to update, but for now we'll just proceed
        await delay(100);
      }
    }
  };

  const runGenerator = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    
    // Initialize artifacts
    const initialArtifacts = artifactDefinitions.map((def) => ({
      ...def,
      content: '',
      status: 'pending' as const,
    })) as ProjectArtifact[];
    setArtifacts(initialArtifacts);
    
    // Initialize code files
    const initialCodeFiles = codeFilesDefinitions.map((def) => ({
      ...def,
      content: '',
      status: 'pending' as const,
    }));
    setCodeFiles(initialCodeFiles);
    
    addTerminalLine({ type: 'info', content: '$ [Generator] Starting project generation...' });

    // Generate documentation artifacts
    addTerminalLine({ type: 'info', content: '$ [Generator] Generating documentation...' });
    for (let i = 0; i < initialArtifacts.length; i++) {
      setArtifacts(prev => prev.map((a, idx) => 
        idx === i ? { ...a, status: 'generating' } : a
      ));
      addTerminalLine({ type: 'info', content: `$ [Generator] Generating ${initialArtifacts[i].title}...` });
      
      const content = await generateArtifact(description, initialArtifacts[i].type);
      
      setArtifacts(prev => prev.map((a, idx) => 
        idx === i ? { ...a, content, status: 'completed' } : a
      ));

      const fileName = `${initialArtifacts[i].type}.md`;
      createFile(fileTree[0]?.id || null, fileName, 'file', content);
      addTerminalLine({ type: 'info', content: `$ [Generator] Created file: ${fileName}` });
    }

    // Generate code files
    addTerminalLine({ type: 'info', content: '$ [Generator] Generating code files...' });
    for (let i = 0; i < initialCodeFiles.length; i++) {
      setCodeFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: 'generating' } : f
      ));
      addTerminalLine({ type: 'info', content: `$ [Generator] Generating ${initialCodeFiles[i].path}...` });
      
      const generatedContent = await generateCode(description, initialCodeFiles[i].type);
      
      // Review, refactor, and optimize the code
      addTerminalLine({ type: 'info', content: `$ [Review Agent] Reviewing and optimizing ${initialCodeFiles[i].path}...` });
      const reviewResult = await reviewCode(generatedContent, initialCodeFiles[i].path, description);
      
      setCodeFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, content: reviewResult.refactoredCode, status: 'completed' } : f
      ));

      createFile(fileTree[0]?.id || null, initialCodeFiles[i].path, 'file', reviewResult.refactoredCode);
      addTerminalLine({ type: 'success', content: `$ [Review Agent] Successfully reviewed and optimized ${initialCodeFiles[i].path}` });
      
      // Log review points
      if (reviewResult.review && reviewResult.review.length > 0) {
        reviewResult.review.forEach((point: string) => {
          addTerminalLine({ type: 'info', content: `  - ${point}` });
        });
      }
      
      // Log improvements
      if (reviewResult.improvements && reviewResult.improvements.length > 0) {
        addTerminalLine({ type: 'info', content: `$ [Review Agent] Key improvements:` });
        reviewResult.improvements.forEach((improvement: string) => {
          addTerminalLine({ type: 'success', content: `  ✅ ${improvement}` });
        });
      }
    }

    setIsGenerating(false);
    addTerminalLine({ type: 'info', content: '$ [Generator] Project generation complete!' });
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-gray-100">
      {mode === 'templates' && (
        <TemplateEngine onSelectTemplate={handleSelectTemplate} />
      )}

      {(mode === 'custom' || mode === 'generating') && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
            <button
              onClick={() => {
                setMode('templates');
                setArtifacts([]);
                setCodeFiles([]);
                setDescription('');
                setSelectedTemplate(null);
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Templates
            </button>
            {selectedTemplate && (
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">{selectedTemplate.name} Template</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          {(artifacts.length > 0 || codeFiles.length > 0) && (
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('docs')}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'docs'
                    ? "border-red-800 text-red-400 bg-red-800/10"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                )}
              >
                Documentation
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'code'
                    ? "border-red-800 text-red-400 bg-red-800/10"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                )}
              >
                Code Files
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {artifacts.length === 0 && codeFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <Zap className="h-16 w-16 text-red-800" />
                <h3 className="text-xl font-semibold text-white">Project Generator</h3>
                <p className="text-gray-400 max-w-sm">
                  Customize your project description below and generate it instantly!
                </p>
              </div>
            ) : activeTab === 'docs' ? (
              artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedArtifact(expandedArtifact === artifact.id ? null : artifact.id)
                    }
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {artifact.status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      ) : artifact.status === 'generating' ? (
                        <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                      ) : (
                        <FileCode className="h-6 w-6 text-gray-400" />
                      )}
                      <div className="flex items-center gap-2">
                        {getIconForArtifact(artifact.type)}
                        <div className="text-left">
                          <p className="font-semibold text-white">{artifact.title}</p>
                          <p className="text-xs text-gray-400 capitalize">
                            {artifact.status === 'generating' ? 'Generating...' : artifact.status}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedArtifact === artifact.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {expandedArtifact === artifact.id && (
                    <div className="border-t border-gray-700 p-4">
                      <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                        {artifact.content}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            ) : (
              codeFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedCodeFile(expandedCodeFile === file.id ? null : file.id)
                    }
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {file.status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      ) : file.status === 'generating' ? (
                        <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                      ) : (
                        <FileCode className="h-6 w-6 text-gray-400" />
                      )}
                      <div className="text-left">
                        <p className="font-semibold text-white">{file.path}</p>
                        <p className="text-xs text-gray-400 capitalize">
                          {file.status === 'generating' ? 'Generating...' : file.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedCodeFile === file.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {expandedCodeFile === file.id && (
                    <div className="border-t border-gray-700 p-4">
                      <pre className="bg-gray-900 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                        {file.content}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project... e.g., Build a CRM with user authentication, contacts, deals, and dashboard"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-800 transition-colors min-h-[100px]"
              />
              <button
                onClick={runGenerator}
                disabled={isGenerating || !description.trim()}
                className="bg-red-800 hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Generate Project
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
