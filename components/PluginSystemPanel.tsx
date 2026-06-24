
'use client';

import React, { useState } from 'react';
import { Puzzle, Plus, Trash2, CheckCircle2, Zap, Settings, Database, Globe } from 'lucide-react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'mcp' | 'native';
  installed: boolean;
}

const PLUGINS: Plugin[] = [
  {
    id: '1',
    name: 'Database MCP',
    description: 'Connect to PostgreSQL, MySQL, MongoDB databases',
    icon: <Database className="w-5 h-5 text-blue-500" />,
    type: 'mcp',
    installed: true
  },
  {
    id: '2',
    name: 'Web Scraper',
    description: 'Scrape data from websites and web pages',
    icon: <Globe className="w-5 h-5 text-green-500" />,
    type: 'mcp',
    installed: false
  },
  {
    id: '3',
    name: 'Code Formatter',
    description: 'Automatically format and beautify your code',
    icon: <Settings className="w-5 h-5 text-purple-500" />,
    type: 'native',
    installed: true
  },
  {
    id: '4',
    name: 'API Tester',
    description: 'Test and debug your API endpoints',
    icon: <Zap className="w-5 h-5 text-orange-500" />,
    type: 'native',
    installed: false
  }
];

export default function PluginSystemPanel() {
  const [plugins, setPlugins] = useState<Plugin[]>(PLUGINS);

  const toggleInstall = (id: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === id ? { ...p, installed: !p.installed } : p
    ));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-purple-400" />
          Plugin & MCP System
        </h3>
        <p className="text-xs text-gray-500 mt-1">Extend SAM AI with plugins</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className="p-4 bg-gray-800 border border-gray-700 rounded-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-700 rounded-lg">
                  {plugin.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    {plugin.name}
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      plugin.type === 'mcp' 
                        ? "bg-blue-500/20 text-blue-400" 
                        : "bg-purple-500/20 text-purple-400"
                    )}>
                      {plugin.type.toUpperCase()}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{plugin.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleInstall(plugin.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2",
                  plugin.installed
                    ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
              >
                {plugin.installed ? (
                  <>
                    <Trash2 className="w-3 h-3" />
                    Uninstall
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    Install
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
