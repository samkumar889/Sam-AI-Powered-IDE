'use client';

import React, { useState } from 'react';
import { ChatPanel } from '@/components/ChatPanel';
import { ProfessionalProductMode } from '@/components/ProfessionalProductMode';
import { DiffReviewPanel } from './DiffReviewPanel';
import { AgentChatPanel } from './AgentChatPanel';
import MultiAgentPanel from '@/components/MultiAgentPanel';
import TestGeneratorAgent from '@/components/TestGeneratorAgent';
import { DeploymentAgent } from '@/components/DeploymentAgent';
import { ProjectMemoryPanel } from '@/components/ProjectMemoryPanel';
import ProjectGeneratorPanel from '@/components/ProjectGeneratorPanel';
import GitPanel from '@/components/GitPanel';
import PluginSystemPanel from '@/components/PluginSystemPanel';
import {
  Bot,
  Sparkles,
  Users,
  CheckCircle,
  TestTube,
  Rocket,
  Brain,
  Wand2,
  GitBranch,
  Puzzle,
  Store,
  Mic,
  Layout,
} from 'lucide-react';

type RightPanelTab = 
  | 'agent' 
  | 'professional' 
  | 'multi-agent' 
  | 'review' 
  | 'tests' 
  | 'deployment' 
  | 'memory' 
  | 'generator' 
  | 'git' 
  | 'plugins'
  | 'marketplace'
  | 'voice'
  | 'visual';

interface RightPanelV2Props {
  visible: boolean;
  onToggle: () => void;
}

export const RightPanelV2 = ({ visible, onToggle }: RightPanelV2Props) => {
  const [activeTab, setActiveTab] = useState<RightPanelTab>('agent');

  if (!visible) return null;

  const tabs = [
    { id: 'agent', icon: Bot, label: 'Agent' },
    { id: 'professional', icon: Sparkles, label: 'Pro' },
    { id: 'multi-agent', icon: Users, label: 'Team' },
    { id: 'generator', icon: Wand2, label: 'Generate' },
    { id: 'git', icon: GitBranch, label: 'Git' },
    { id: 'plugins', icon: Puzzle, label: 'Plugins' },
    { id: 'marketplace', icon: Store, label: 'Store' },
    { id: 'review', icon: CheckCircle, label: 'Review' },
    { id: 'tests', icon: TestTube, label: 'Tests' },
    { id: 'deployment', icon: Rocket, label: 'Deploy' },
    { id: 'memory', icon: Brain, label: 'Memory' },
    { id: 'voice', icon: Mic, label: 'Voice' },
    { id: 'visual', icon: Layout, label: 'Builder' },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'agent':
        return <AgentChatPanel />;
      case 'professional':
        return <ProfessionalProductMode />;
      case 'multi-agent':
        return <MultiAgentPanel />;
      case 'generator':
        return <ProjectGeneratorPanel />;
      case 'git':
        return <GitPanel />;
      case 'plugins':
        return <PluginSystemPanel />;
      case 'review':
        return <DiffReviewPanel />;
      case 'tests':
        return <TestGeneratorAgent />;
      case 'deployment':
        return <DeploymentAgent />;
      case 'memory':
        return <ProjectMemoryPanel />;
      default:
        const currentTab = tabs.find((t) => t.id === activeTab);
        const Icon = currentTab?.icon;
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mb-3 text-gray-500">
              {Icon && <Icon className="w-8 h-8" />}
            </div>
            <h3 className="text-sm font-medium text-gray-300">
              {currentTab?.label}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="w-96 flex flex-col bg-gray-900 border-l border-gray-800">
      {/* Tab Header */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-800 bg-gray-800/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              p-1.5 rounded-md text-xs flex-shrink-0 transition-colors
              ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-500 hover:text-gray-300'
              }
            `}
            title={tab.label}
          >
            <tab.icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
};
