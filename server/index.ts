import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// File types to ignore
const IGNORE_PATHS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  '.env',
  'prisma',
  'server'
];

// File extensions to index
const INDEX_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.html', '.css', '.scss', '.json',
  '.md', '.py', '.java', '.go', '.rs'
];

// In-memory storage (since we might not have Prisma set up yet)
interface Document {
  id: string;
  path: string;
  content: string;
}

interface Chunk {
  id: string;
  documentId: string;
  content: string;
  startLine: number;
  endLine: number;
  document: Document;
}

const documents: Map<string, Document> = new Map();
const chunks: Chunk[] = [];

// Helper: Chunk file content
const chunkFile = (content: string, maxChunkSize: number = 1000) => {
  const lines = content.split('\n');
  const resultChunks: { content: string; startLine: number; endLine: number }[] = [];
  let currentChunk = '';
  let startLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (currentChunk.length + line.length > maxChunkSize && currentChunk.length > 0) {
      resultChunks.push({
        content: currentChunk.trim(),
        startLine: startLine + 1,
        endLine: i
      });
      currentChunk = line;
      startLine = i;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  }

  if (currentChunk.trim()) {
    resultChunks.push({
      content: currentChunk.trim(),
      startLine: startLine + 1,
      endLine: lines.length
    });
  }

  return resultChunks;
};

// Helper: Scan directory
const scanDirectory = (dir: string, baseDir: string) => {
  const results: { path: string; content: string }[] = [];
  
  const scan = (currentDir: string) => {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      
      // Check if we should ignore this path
      const shouldIgnore = IGNORE_PATHS.some(ignore => 
        relativePath.includes(ignore) || file.startsWith(ignore)
      );
      
      if (shouldIgnore) continue;
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scan(fullPath);
      } else {
        const ext = path.extname(file);
        if (INDEX_EXTENSIONS.includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          results.push({ path: relativePath, content });
        }
      }
    }
  };
  
  scan(dir);
  return results;
};

// API Routes

// 1. Index entire project
app.post('/api/index', async (req, res) => {
  try {
    const projectDir = path.join(__dirname, '..');
    console.log(`Indexing project at: ${projectDir}`);
    
    // Clear existing data
    documents.clear();
    chunks.length = 0;
    
    // Scan files
    const files = scanDirectory(projectDir, projectDir);
    console.log(`Found ${files.length} files to index`);
    
    // Process each file
    for (const file of files) {
      try {
        const docId = Math.random().toString(36).substr(2, 9);
        const document: Document = {
          id: docId,
          path: file.path,
          content: file.content
        };
        
        documents.set(file.path, document);
        
        // Chunk the file
        const fileChunks = chunkFile(file.content);
        
        // Create chunks
        for (const chunk of fileChunks) {
          chunks.push({
            id: Math.random().toString(36).substr(2, 9),
            documentId: docId,
            content: chunk.content,
            startLine: chunk.startLine,
            endLine: chunk.endLine,
            document
          });
        }
        
        console.log(`Indexed: ${file.path} (${fileChunks.length} chunks)`);
      } catch (err) {
        console.error(`Failed to index ${file.path}:`, err);
      }
    }
    
    res.json({
      success: true,
      filesIndexed: files.length,
      totalChunks: chunks.length,
      message: 'Project indexed successfully'
    });
  } catch (err) {
    console.error('Indexing failed:', err);
    res.status(500).json({ success: false, error: 'Failed to index project' });
  }
});

// 2. Semantic search
app.post('/api/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }
    
    // Simple keyword search
    const lowerQuery = query.toLowerCase();
    const rankedResults = chunks.map(chunk => {
      const count = chunk.content.toLowerCase().split(lowerQuery).length - 1;
      return {
        id: chunk.id,
        documentId: chunk.documentId,
        path: chunk.document.path,
        content: chunk.content,
        startLine: chunk.startLine,
        endLine: chunk.endLine,
        score: count
      };
    }).sort((a, b) => b.score - a.score).filter(r => r.score > 0);
    
    // If no keyword matches, return top chunks
    const results = rankedResults.length > 0 
      ? rankedResults 
      : chunks.slice(0, limit).map(chunk => ({
          id: chunk.id,
          documentId: chunk.documentId,
          path: chunk.document.path,
          content: chunk.content,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
          score: 0
        }));
    
    res.json({
      success: true,
      query,
      results: results.slice(0, limit)
    });
  } catch (err) {
    console.error('Search failed:', err);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// 3. Get all indexed documents
app.get('/api/documents', async (req, res) => {
  try {
    const docs = Array.from(documents.values()).map(d => ({
      id: d.id,
      path: d.path
    }));
    res.json({ success: true, documents: docs });
  } catch (err) {
    console.error('Failed to fetch documents:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch documents' });
  }
});

// 4. Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Codebase indexing server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - POST /api/index - Index the project`);
  console.log(`  - POST /api/search - Semantic search`);
  console.log(`  - GET /api/documents - List indexed documents`);
  console.log(`  - GET /api/health - Health check`);
});
