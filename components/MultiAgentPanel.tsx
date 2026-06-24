
'use client';

import React, { useState } from 'react';
import { AGENTS, Agent, AgentType, AgentConversation, AgentTask } from '@/lib/multiAgentSystem';
import { X, Send, Bot, User, CheckCircle2, Clock, AlertCircle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MultiAgentPanel() {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS.find(a => a.type === 'master')!);
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks'>('chat');
  const [messages, setMessages] = useState<AgentConversation[]>([
    {
      id: '1',
      role: 'agent',
      agentType: 'master',
      content: 'Hi! I\'m your Master Agent. I coordinate all other agents. What would you like to build today?',
      timestamp: Date.now()
    }
  ]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: AgentConversation = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate agent thinking
    await new Promise(r => setTimeout(r, 1000));

    // Add agent response
    const agentResponse: AgentConversation = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'agent',
      agentType: selectedAgent.type,
      content: `Got it! I'll handle this as your ${selectedAgent.name}.`,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, agentResponse]);
    
    // Create a task
    const newTask: AgentTask = {
      id: Math.random().toString(36).substr(2, 9),
      agentType: selectedAgent.type,
      description: input,
      status: 'in_progress',
      createdAt: Date.now()
    };
    
    setTasks(prev => [...prev, newTask]);

    // Simulate task completion
    await new Promise(r => setTimeout(r, 2000));
    
    setTasks(prev => prev.map(t => 
      t.id === newTask.id 
        ? { ...t, status: 'completed', completedAt: Date.now(), result: 'Task completed!' } 
        : t
    ));

    setIsProcessing(false);
  };

  const getStatusIcon = (status: AgentTask['status']) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <PlayCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-400" />
          Multi-Agent System
        </h3>
        <p className="text-xs text-gray-400 mt-1">Collaborate with specialized AI agents</p>
      </div>

      {/* Agent Selector */}
      <div className="p-3 border-b border-gray-800 bg-gray-900/30">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all",
                selectedAgent.type === agent.type 
                  ? `${agent.color} text-white shadow-lg`
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              )}
            >
              <span className="text-lg">{agent.icon}</span>
              <span className="font-medium">{agent.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Agent Info */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/30">
        <h4 className="text-sm font-semibold text-white">{selectedAgent.name}</h4>
        <p className="text-xs text-gray-400 mt-1">{selectedAgent.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedAgent.capabilities.map((cap, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 bg-gray-900/20">
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === 'chat' 
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-gray-400 hover:text-gray-300"
          )}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === 'tasks' 
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-gray-400 hover:text-gray-300"
          )}
        >
          Tasks
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'chat' ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === 'user' 
                      ? "bg-blue-600" 
                      : AGENTS.find(a => a.type === msg.agentType)?.color || "bg-emerald-600"
                  )}>
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-sm">{AGENTS.find(a => a.type === msg.agentType)?.icon}</span>
                    )}
                  </div>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-800 text-gray-100"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", selectedAgent.color)}>
                    <span className="text-sm">{selectedAgent.icon}</span>
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-800 text-gray-400 text-sm">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Ask ${selectedAgent.name}...`}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSend}
                  disabled={isProcessing}
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white rounded-xl transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Clock className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">No tasks yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-gray-800/50 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">
                            {AGENTS.find(a => a.type === task.agentType)?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(task.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{task.description}</p>
                        {task.result && (
                          <p className="text-xs text-green-400 mt-2">{task.result}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
