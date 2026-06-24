'use client';

import { useAppStore } from '@/store/useAppStore';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { RefreshCw, Lock, AlertCircle, Loader2 } from 'lucide-react';

function findFileInTree(nodes: any[], name: string): any {
  for (const node of nodes) {
    if (node.name === name && node.type === 'file') {
      return node;
    }
    if (node.children) {
      const found = findFileInTree(node.children, name);
      if (found) return found;
    }
  }
  return null;
}

export function PreviewPanel() {
  const { fileTree } = useAppStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Find index.html, style.css, app.js
  const indexHtml = findFileInTree(fileTree, 'index.html');
  const styleCss = findFileInTree(fileTree, 'style.css');
  const appJs = findFileInTree(fileTree, 'app.js');

  const fullHtml = useMemo(() => {
    if (!indexHtml || !indexHtml.content) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * {
      box-sizing: border-box;
    }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
    }
    .container {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 { 
      font-size: 2.5rem; 
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p { 
      color: #666; 
      font-size: 1.1rem;
      line-height: 1.6;
    }
    .logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }
    .logo svg {
      width: 40px;
      height: 40px;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
    </div>
    <h1>Welcome to SAM AI!</h1>
    <p>Ask the Agent to build a website, or edit files in the explorer panel!</p>
  </div>
</body>
</html>`;
    }
    
    let finalHtml = indexHtml.content;
    
    // Only remove local style.css link (we'll inject it inline)
    // Keep all external CDN styles/scripts
    finalHtml = finalHtml
      .replace(/<link\s+rel=["']stylesheet["']\s+href=["'](?!https?:\/\/)[^"']*["']\s*\/?>/gi, '')
      .replace(/<script\s+src=["'](?!https?:\/\/)[^"']*["']\s*>\s*<\/script>/gi, '');
    
    // Inject CSS if present
    if (styleCss?.content) {
      const styleTag = `<style>${styleCss.content}</style>`;
      if (finalHtml.includes('</head>')) {
        finalHtml = finalHtml.replace('</head>', `${styleTag}</head>`);
      } else if (finalHtml.includes('<head>')) {
        finalHtml = finalHtml.replace('<head>', `<head>${styleTag}`);
      } else {
        finalHtml = `<head>${styleTag}</head>` + finalHtml;
      }
    }

    // Inject JS if present
    if (appJs?.content) {
      // Wrap JS to prevent any infinite loops with parent
      const wrappedJs = `
        try {
          ${appJs.content}
        } catch (e) {
          console.error('Preview script error:', e);
        }
      `;
      const scriptTag = `<script>${wrappedJs}</script>`;
      if (finalHtml.includes('</body>')) {
        finalHtml = finalHtml.replace('</body>', `${scriptTag}</body>`);
      } else {
        finalHtml = finalHtml + scriptTag;
      }
    }

    return finalHtml;
  }, [indexHtml?.content, styleCss?.content, appJs?.content]);

  useEffect(() => {
    // Automatically hide loading state after a short delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [fullHtml, refreshKey]);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Browser Top Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
        {/* Window Controls */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#e04840] transition-colors" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#e0a524] transition-colors" />
          <div className="w-3 h-3 rounded-full bg-[#28c940] hover:bg-[#20a835] transition-colors" />
        </div>
        
        {/* URL Bar */}
        <div className="flex-1 mx-2 flex items-center gap-2 bg-[#1e1e1e] border border-gray-700 rounded-full px-3 py-1">
          <Lock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-300">preview://local</span>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
          title="Refresh Preview"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Preview Content */}
      <div className="flex-1 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Loading preview...</p>
            </div>
          </div>
        )}
        <iframe
          key={refreshKey}
          srcDoc={fullHtml}
          className="w-full h-full border-0 bg-white"
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          onLoad={handleLoad}
        />
      </div>
    </div>
  );
}