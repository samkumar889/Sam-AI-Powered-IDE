'use client';

import { useAppStore } from '@/store/useAppStore';
import { ChatPanel } from '@/components/ChatPanel';
import { SearchPanel } from '@/components/SearchPanel';
import { AgentPanel } from './AgentPanel';
import { FileOperationsTest } from '@/components/FileOperationsTest';
import { ProjectGeneratorAgent } from '@/components/ProjectGeneratorAgent';
import { MultiAgentSystem } from '@/components/MultiAgentSystem';
import { MasterBuilder } from '@/components/MasterBuilder';
import { DeploymentAgent } from '@/components/DeploymentAgent';
import TestGeneratorAgent from '@/components/TestGeneratorAgent';
import { ProfessionalProductMode } from '@/components/ProfessionalProductMode';
import { MessageSquare, Search as SearchIcon, Bot, FileCode, Sparkles, Users, Rocket, Cog, TestTube, Zap } from 'lucide-react';

export function RightPanel() {
  const { rightPanelActiveTab, setRightPanelActiveTab } = useAppStore();

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare, component: ChatPanel },
    { id: 'search', label: 'Search', icon: SearchIcon, component: SearchPanel },
    { id: 'agent', label: 'Agent', icon: Bot, component: AgentPanel },
    { id: 'project-generator', label: 'Generator', icon: Sparkles, component: ProjectGeneratorAgent },
    { id: 'professional-mode', label: 'Professional', icon: Zap, component: ProfessionalProductMode },
    { id: 'multi-agent', label: 'Team', icon: Users, component: MultiAgentSystem },
    { id: 'master-builder', label: 'Builder', icon: Rocket, component: MasterBuilder },
    { id: 'deployment', label: 'Deploy', icon: Cog, component: DeploymentAgent },
    { id: 'test-generator', label: 'Tests', icon: TestTube, component: TestGeneratorAgent },
    { id: 'file-ops', label: 'File Ops', icon: FileCode, component: FileOperationsTest },
  ] as const;

  const ActiveComponent = tabs.find(tab => tab.id === rightPanelActiveTab)?.component || ChatPanel;

  return (
    <div className="flex w-[400px] flex-col bg-[#0f172a] border-l border-gray-800">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRightPanelActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              rightPanelActiveTab === tab.id
                ? 'bg-gray-800 text-red-400 border-b-2 border-red-600'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ActiveComponent />
      </div>
    </div>
  );
}
