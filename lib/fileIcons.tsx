
import React from 'react';
import {
  FileCode,
  FileJson,
  FileText,
} from 'lucide-react';

export function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const lowerName = name.toLowerCase();

  if (lowerName === 'package.json' || lowerName === 'package-lock.json' || lowerName === 'pnpm-lock.yaml' || lowerName === 'yarn.lock') {
    return <FileCode className="h-4 w-4 text-red-500" />;
  }
  if (lowerName === 'tsconfig.json' || lowerName === 'tsconfig.node.json') {
    return <FileCode className="h-4 w-4 text-blue-600" />;
  }
  if (lowerName === 'next.config.js' || lowerName === 'next.config.ts' || lowerName === 'next.config.mjs') {
    return <FileCode className="h-4 w-4 text-gray-300" />;
  }
  if (lowerName === 'tailwind.config.js' || lowerName === 'tailwind.config.ts' || lowerName === 'tailwind.config.mjs') {
    return <FileCode className="h-4 w-4 text-cyan-400" />;
  }
  if (lowerName === 'webpack.config.js' || lowerName === 'webpack.config.ts' || lowerName === 'vite.config.js' || lowerName === 'vite.config.ts') {
    return <FileCode className="h-4 w-4 text-purple-500" />;
  }
  if (lowerName === 'readme.md' || lowerName === 'readme.markdown') {
    return <FileText className="h-4 w-4 text-yellow-400" />;
  }
  if (lowerName === 'license' || lowerName === 'license.md') {
    return <FileText className="h-4 w-4 text-green-500" />;
  }
  if (lowerName === '.gitignore' || lowerName === '.gitattributes' || lowerName === '.gitmodules') {
    return <FileCode className="h-4 w-4 text-orange-400" />;
  }
  if (lowerName === '.env' || lowerName.startsWith('.env.')) {
    return <FileText className="h-4 w-4 text-yellow-500" />;
  }
  if (lowerName === 'prisma/schema.prisma' || name.endsWith('.prisma')) {
    return <FileCode className="h-4 w-4 text-indigo-500" />;
  }

  switch (ext) {
    case 'html':
    case 'htm':
      return <FileCode className="h-4 w-4 text-orange-500" />;
    case 'css':
      return <FileCode className="h-4 w-4 text-blue-500" />;
    case 'scss':
    case 'sass':
      return <FileCode className="h-4 w-4 text-pink-500" />;
    case 'less':
      return <FileCode className="h-4 w-4 text-purple-400" />;
    case 'js':
      return <FileCode className="h-4 w-4 text-yellow-400" />;
    case 'jsx':
      return <FileCode className="h-4 w-4 text-cyan-400" />;
    case 'ts':
      return <FileCode className="h-4 w-4 text-blue-600" />;
    case 'tsx':
      return <FileCode className="h-4 w-4 text-blue-400" />;
    case 'vue':
      return <FileCode className="h-4 w-4 text-emerald-500" />;
    case 'py':
      return <FileCode className="h-4 w-4 text-blue-500" />;
    case 'java':
      return <FileCode className="h-4 w-4 text-red-500" />;
    case 'go':
      return <FileCode className="h-4 w-4 text-cyan-500" />;
    case 'rs':
      return <FileCode className="h-4 w-4 text-orange-500" />;
    case 'php':
      return <FileCode className="h-4 w-4 text-purple-500" />;
    case 'rb':
      return <FileCode className="h-4 w-4 text-red-400" />;
    case 'c':
    case 'cpp':
    case 'cxx':
    case 'cc':
      return <FileCode className="h-4 w-4 text-blue-600" />;
    case 'cs':
      return <FileCode className="h-4 w-4 text-green-600" />;
    case 'swift':
      return <FileCode className="h-4 w-4 text-orange-400" />;
    case 'kt':
    case 'kts':
      return <FileCode className="h-4 w-4 text-purple-600" />;
    case 'sql':
      return <FileCode className="h-4 w-4 text-blue-400" />;
    case 'json':
      return <FileJson className="h-4 w-4 text-yellow-400" />;
    case 'yaml':
    case 'yml':
      return <FileJson className="h-4 w-4 text-cyan-300" />;
    case 'xml':
      return <FileCode className="h-4 w-4 text-orange-400" />;
    case 'md':
    case 'markdown':
      return <FileText className="h-4 w-4 text-blue-300" />;
    case 'txt':
    case 'log':
      return <FileText className="h-4 w-4 text-gray-400" />;
    case 'sh':
    case 'bash':
    case 'zsh':
      return <FileCode className="h-4 w-4 text-green-500" />;
    case 'bat':
    case 'cmd':
      return <FileCode className="h-4 w-4 text-purple-400" />;
    case 'ps1':
      return <FileCode className="h-4 w-4 text-blue-300" />;
    case 'svg':
      return <FileCode className="h-4 w-4 text-orange-300" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'ico':
      return <FileCode className="h-4 w-4 text-purple-300" />;
    case 'pdf':
      return <FileText className="h-4 w-4 text-red-400" />;
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
      return <FileCode className="h-4 w-4 text-yellow-600" />;
    case 'lock':
      return <FileJson className="h-4 w-4 text-cyan-400" />;
    case 'config':
      return <FileText className="h-4 w-4 text-gray-500" />;
    default:
      return <FileText className="h-4 w-4 text-blue-300" />;
  }
}
