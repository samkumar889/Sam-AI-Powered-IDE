'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Layout,
  Settings,
  MessageSquare,
  Bot,
  Folder,
  FileCode,
  Box,
  Code2,
  Palette,
  Type,
  Save,
  Globe
} from 'lucide-react';

// Recursive component for architecture tree
const ArchitectureNode = ({
  node,
  level = 0
}: {
  node: any;
  level?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getIcon = () => {
    switch (node.type) {
      case 'folder': return <Folder className="h-4 w-4 text-yellow-400" />;
      case 'component': return <Box className="h-4 w-4 text-purple-400" />;
      case 'function': return <Code2 className="h-4 w-4 text-green-400" />;
      case 'class': return <Code2 className="h-4 w-4 text-blue-400" />;
      default: return <FileCode className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-700 cursor-pointer transition-colors`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => node.children && setIsExpanded(!isExpanded)}
      >
        {node.children && (
          <span className="text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {getIcon()}
        <span className="text-sm text-gray-200">{node.name}</span>
      </div>
      {node.description && (
        <div className="pl-8 pr-2 pb-1">
          <p className="text-xs text-gray-500">{node.description}</p>
        </div>
      )}
      {isExpanded && node.children?.map((child: any) => (
        <ArchitectureNode key={child.id} node={child} level={level + 1} />
      ))}
    </div>
  );
};

export function ProjectMemoryPanel() {
  const {
    projectMemory,
    updatePreferences,
    clearConversationHistory
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'architecture' | 'preferences' | 'conversations' | 'tasks'>('architecture');

  const tabs = [
    { id: 'architecture', icon: Layout, label: 'Architecture' },
    { id: 'preferences', icon: Settings, label: 'Preferences' },
    { id: 'conversations', icon: MessageSquare, label: 'History' },
    { id: 'tasks', icon: Bot, label: 'Tasks' },
  ];

  return (
    <div className="flex h-full w-80 flex-col border-r border-gray-700 bg-[#0f172a]">
      <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
          Memory
        </span>
      </div>

      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-gray-800 text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon className="h-3 w-3" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Architecture Tab */}
        {activeTab === 'architecture' && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Project Structure</h3>
            {projectMemory.architecture.map((node) => (
              <ArchitectureNode key={node.id} node={node} />
            ))}
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">User Preferences</h3>

            {/* Theme */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </label>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => updatePreferences({ theme: t })}
                    className={`flex-1 py-2 text-xs rounded border transition-colors ${
                      projectMemory.preferences.theme === t
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 flex items-center gap-2">
                <Type className="h-4 w-4" />
                Font Size: {projectMemory.preferences.fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={projectMemory.preferences.fontSize}
                onChange={(e) => updatePreferences({ fontSize: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Auto Save */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 flex items-center gap-2">
                <Save className="h-4 w-4" />
                Auto Save
              </label>
              <button
                onClick={() => updatePreferences({ autoSave: !projectMemory.preferences.autoSave })}
                className={`w-full py-2 text-xs rounded border transition-colors ${
                  projectMemory.preferences.autoSave
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {projectMemory.preferences.autoSave ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language
              </label>
              <select
                value={projectMemory.preferences.language}
                onChange={(e) => updatePreferences({ language: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        )}

        {/* Conversations Tab */}
        {activeTab === 'conversations' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Previous Conversations</h3>
              {projectMemory.previousConversations.length > 0 && (
                <button
                  onClick={clearConversationHistory}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear All
                </button>
              )}
            </div>
            {projectMemory.previousConversations.length === 0 ? (
              <p className="text-xs text-gray-500">No conversations yet</p>
            ) : (
              projectMemory.previousConversations.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <p className={`text-xs ${msg.role === 'user' ? 'text-blue-300' : 'text-purple-300'}`}>
                    {msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}
                  </p>
                  <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                    {msg.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Agent Task History</h3>
            {projectMemory.agentTaskHistory.length === 0 ? (
              <p className="text-xs text-gray-500">No agent tasks yet</p>
            ) : (
              projectMemory.agentTaskHistory.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-200">
                      {task.description}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        task.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                        task.status === 'failed' ? 'bg-red-900/30 text-red-400' :
                        'bg-yellow-900/30 text-yellow-400'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {task.createdAt.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {task.steps.length} steps
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
