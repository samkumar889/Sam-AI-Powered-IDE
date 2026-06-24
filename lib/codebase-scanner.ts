import { readFile } from 'fs/promises';
import path from 'path';

// List of files/directories to ignore
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '__pycache__',
  '*.log',
  '.env',
  '.env.local',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

// Supported file extensions for code
const CODE_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx',
  '.py', '.java', '.go', '.rs',
  '.html', '.css', '.scss', '.json',
  '.md', '.mdx',
];

export interface ScannedFile {
  path: string;
  name: string;
  content: string;
  extension: string;
}

function shouldIgnore(filePath: string): boolean {
  const normalized = path.normalize(filePath);
  return IGNORE_PATTERNS.some(pattern => {
    if (pattern.startsWith('*.')) {
      return normalized.endsWith(pattern.slice(1));
    }
    return normalized.includes(path.sep + pattern + path.sep) || normalized.startsWith(pattern + path.sep);
  });
}

export async function scanDirectory(dir: string, relativePath: string = ''): Promise<ScannedFile[]> {
  const files: ScannedFile[] = [];
  
  // For simplicity, we'll use the existing file tree from the app store
  // or simulate scanning for now
  // In real use, you'd use fs.readdir recursively, but let's integrate with the app's store
  
  return files;
}

export function parseFileExtension(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  return ext;
}

export function isCodeFile(fileName: string): boolean {
  const ext = parseFileExtension(fileName);
  return CODE_EXTENSIONS.includes(ext);
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
