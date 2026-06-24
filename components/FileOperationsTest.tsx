
'use client';

import { useState } from 'react';
import { fileOperations } from '@/lib/fileOperations';

export function FileOperationsTest() {
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
    path: string;
    content: string;
    newContent: string;
    newName: string;
    type: 'file' | 'folder';
    mode: 'overwrite' | 'append' | 'prepend';
  }>({
    path: '',
    content: '',
    newContent: '',
    newName: '',
    type: 'file',
    mode: 'overwrite'
  });

  const addResult = (result: any) => {
    setResults(prev => [result, ...prev].slice(0, 10)); // Keep last 10 results
  };

  const executeOperation = () => {
    if (!activeOperation) return;
    
    let result;
    switch (activeOperation) {
      case 'read':
        result = fileOperations.readFile(formData.path);
        break;
      case 'write':
        result = fileOperations.writeFile(formData.path, formData.content);
        break;
      case 'update':
        result = fileOperations.updateFile(formData.path, formData.newContent, formData.mode);
        break;
      case 'create':
        result = fileOperations.createFile(formData.path, formData.type, formData.content);
        break;
      case 'delete':
        result = fileOperations.deleteFile(formData.path);
        break;
      case 'rename':
        result = fileOperations.renameFile(formData.path, formData.newName);
        break;
    }
    
    addResult(result);
  };

  const operations = [
    { id: 'read', label: 'Read File' },
    { id: 'write', label: 'Write File' },
    { id: 'update', label: 'Update File' },
    { id: 'create', label: 'Create File/Folder' },
    { id: 'delete', label: 'Delete File/Folder' },
    { id: 'rename', label: 'Rename File/Folder' }
  ];

  return (
    <div className="p-4 bg-[#0f172a] text-gray-200 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-white">File Operations Test</h2>
      
      {/* Operation Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {operations.map(op => (
          <button
            key={op.id}
            onClick={() => setActiveOperation(activeOperation === op.id ? null : op.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeOperation === op.id ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Active Operation Form */}
      {activeOperation && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
          <h3 className="font-semibold mb-3 text-purple-400">
            {operations.find(o => o.id === activeOperation)?.label}
          </h3>
          
          <div className="space-y-3">
            {/* Path Input (all operations) */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Path</label>
              <input
                type="text"
                value={formData.path}
                onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                placeholder="e.g., samai-project/index.html"
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Content Input (read, write, create, update) */}
            {(activeOperation === 'write' || activeOperation === 'create') && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter file content"
                  rows={5}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {/* Type Selector (create only) */}
            {activeOperation === 'create' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'file' | 'folder' }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="file">File</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
            )}

            {/* New Content & Mode (update only) */}
            {activeOperation === 'update' && (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">New Content</label>
                  <textarea
                    value={formData.newContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, newContent: e.target.value }))}
                    placeholder="Enter new content"
                    rows={5}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Update Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value as any }))}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="overwrite">Overwrite</option>
                    <option value="append">Append</option>
                    <option value="prepend">Prepend</option>
                  </select>
                </div>
              </>
            )}

            {/* New Name (rename only) */}
            {activeOperation === 'rename' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Name</label>
                <input
                  type="text"
                  value={formData.newName}
                  onChange={(e) => setFormData(prev => ({ ...prev, newName: e.target.value }))}
                  placeholder="Enter new name"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={executeOperation}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition-colors"
            >
              Execute
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400">Results</h3>
          {results.map((result, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border text-sm ${
                result.success ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'
              }`}
            >
              <div className={`font-medium mb-1 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                {result.success ? 'Success' : 'Error'}
              </div>
              <div className="text-gray-300">{result.message}</div>
              {result.data && (
                <pre className="mt-2 bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
