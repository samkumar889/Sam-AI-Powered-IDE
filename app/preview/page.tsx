'use client';

import { useEffect, useState } from 'react';

export default function PreviewPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    // Get the files from sessionStorage
    const storedFiles = sessionStorage.getItem('sam-ai-deployed-files');
    
    if (storedFiles) {
      try {
        const files = JSON.parse(storedFiles);
        
        let html = '<!DOCTYPE html><html lang="en"><head><title>SAM AI Preview</title></head><body><h1>Preview Not Available</h1></body></html>';
        let css = '';
        let js = '';

        for (const file of files) {
          if (file.name.toLowerCase().endsWith('.html')) {
            html = file.content;
          } else if (file.name.toLowerCase().endsWith('.css')) {
            css += file.content + '\n';
          } else if (file.name.toLowerCase().endsWith('.js')) {
            js += file.content + '\n';
          }
        }

        const fullHTML = html
          .replace('</head>', `<style>${css}</style></head>`)
          .replace('</body>', `<script>${js}</script></body>`);

        setHtmlContent(fullHTML);
      } catch (e) {
        console.error('Failed to parse files:', e);
      }
    } else {
      // If no files stored, redirect home after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  }, []);

  if (!htmlContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={htmlContent}
      title="SAM AI Preview"
      className="w-screen h-screen border-0 bg-white"
      sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
    />
  );
}
