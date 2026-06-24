'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Code, 
  StopCircle, 
  CheckCircle, 
  Clock,
  ChevronDown,
  ChevronRight,
  Zap,
  Target,
  FileText,
  Settings,
  FileCode,
  Trash2,
  Plus,
  Send,
  X,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore, AgentAction, AgentFileChange } from '@/store/useAppStore';
import DiffView from './DiffView';

const WORKFLOW_STAGES: Array<{ 
  id: "analyzing" | "planning" | "executing" | "reviewing" | "fixing" | "completed" | "failed"; 
  label: string; 
  icon: React.ComponentType<{ size: number }>; 
}> = [
  { id: "analyzing", label: "Analyze", icon: Brain },
  { id: "planning", label: "Plan", icon: Target },
  { id: "executing", label: "Execute", icon: Zap },
  { id: "reviewing", label: "Review", icon: CheckCircle },
  { id: "fixing", label: "Fix", icon: Code }
];

export default function AgentModePanel() {
  const { 
    agentWorkflow, 
    startAgentWorkflow, 
    updateAgentWorkflowStatus, 
    addAgentAction, 
    updateAgentStep,
    applyAllPendingChanges,
    discardAllPendingChanges,
    removePendingFileChange
  } = useAppStore();
  
  const [prompt, setPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  const [expandedFileChanges, setExpandedFileChanges] = useState<Set<string>>(new Set());

  const handleStart = async () => {
    if (!prompt.trim()) return;
    setIsRunning(true);
    await startAgentWorkflow(prompt);
    setTimeout(() => {
      setIsRunning(false);
    }, 2500);
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const toggleAction = (actionId: string) => {
    setExpandedActions((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  };

  const toggleFileChange = (path: string) => {
    setExpandedFileChanges((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const getStepIcon = (status: 'pending' | 'in-progress' | 'completed' | 'failed') => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'in-progress':
        return <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Clock size={16} className="text-accent" />
        </motion.div>;
      case 'failed':
        return <StopCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-text-muted" />;
    }
  };

  const getActionIcon = (type: AgentAction['type']) => {
    switch (type) {
      case 'read':
        return <FileText size={16} className="text-blue-500" />;
      case 'edit':
        return <FileCode size={16} className="text-yellow-500" />;
      case 'create':
        return <Plus size={16} className="text-green-500" />;
      case 'delete':
        return <Trash2 size={16} className="text-red-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">Agent Mode</h2>
          <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="p-4 border-b border-border">
        <div className="space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want the agent to build or fix..."
            className="w-full h-20 px-3 py-2 bg-panel border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:border-accent transition-colors resize-none"
            disabled={isRunning}
          />
          <button
            onClick={handleStart}
            disabled={isRunning || !prompt.trim()}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium",
              isRunning || !prompt.trim() 
                ? "bg-text-muted text-white cursor-not-allowed opacity-50" 
                : "bg-accent hover:bg-accent-hover text-white"
            )}
          >
            {isRunning ? (
              <>
                <Clock size={16} className="animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Start Agent</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Workflow Visualization */}
      {agentWorkflow && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Workflow</span>
          </div>
          <div className="flex items-center gap-1">
            {WORKFLOW_STAGES.map((stage, index) => {
              const StageIcon = stage.icon;
              const isActive = agentWorkflow.status === stage.id;
              const isCompleted = 
                ["analyzing", "planning", "executing", "reviewing", "fixing"].indexOf(stage.id) < 
                ["analyzing", "planning", "executing", "reviewing", "fixing"].indexOf(agentWorkflow.status);

              return (
                <React.Fragment key={stage.id}>
                  <div className={cn(
                    "flex-1 min-w-0 text-center py-1.5 px-2 rounded transition-colors text-xs",
                    isActive ? "bg-accent text-white" : 
                    isCompleted ? "bg-green-500/20 text-green-400" : 
                    "bg-panel text-text-muted"
                  )}>
                    <div className="flex items-center justify-center gap-1">
                      <StageIcon size={12} />
                      <span className="truncate">{stage.label}</span>
                    </div>
                  </div>
                  {index < WORKFLOW_STAGES.length - 1 && (
                    <div className="w-4 h-0.5 bg-border" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending Changes */}
      {agentWorkflow && agentWorkflow.status === 'pendingReview' && agentWorkflow.pendingFileChanges.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileCode size={14} className="text-text-muted" />
            <h3 className="text-xs font-semibold text-text-muted uppercase">
              Proposed Changes ({agentWorkflow.pendingFileChanges.length} files)
            </h3>
          </div>
          <div className="space-y-3">
            {agentWorkflow.pendingFileChanges.map((change: AgentFileChange, index: number) => {
              const isExpanded = expandedFileChanges.has(change.path);
              const fileIcon = change.type === 'create' ? <Plus size={14} className="text-green-400" /> : 
                              change.type === 'modify' ? <FileCode size={14} className="text-yellow-400" /> : 
                              <Trash2 size={14} className="text-red-400" />;
              
              return (
                <motion.div
                  key={change.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFileChange(change.path)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      {fileIcon}
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-200 truncate max-w-[200px]">
                          {change.path}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {change.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePendingFileChange(change.path);
                        }}
                        className="p-1 hover:bg-red-900/30 rounded text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <DiffView
                          originalContent={change.originalContent}
                          newContent={change.content || ''}
                          type={change.type}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Apply/Discard Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={applyAllPendingChanges}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              <Check size={16} />
              Apply All
            </button>
            <button
              onClick={discardAllPendingChanges}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              <X size={16} />
              Discard All
            </button>
          </div>
        </div>
      )}

      {/* Steps */}
      {agentWorkflow && agentWorkflow.status !== 'pendingReview' && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} className="text-text-muted" />
            <h3 className="text-xs font-semibold text-text-muted uppercase">Steps</h3>
          </div>
          <div className="space-y-2">
            {agentWorkflow.steps.map((step, index) => {
              const isExpanded = expandedSteps.has(step.id);
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    step.status === 'completed' && "border-green-500/30 bg-green-500/5",
                    step.status === 'in-progress' && "border-accent/30 bg-accent/5",
                    step.status === 'failed' && "border-red-500/30 bg-red-500/5",
                    step.status === 'pending' && "border-border bg-panel"
                  )}
                >
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="w-full flex items-start gap-3 text-left"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {getStepIcon(step.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">{step.name}</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">{step.description}</p>
                    </div>
                    {isExpanded ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronRight size={14} className="text-text-muted" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 pt-3 border-t border-border overflow-hidden"
                      >
                        {step.result && (
                          <pre className="text-xs text-text-secondary bg-black/30 rounded p-2 overflow-x-auto">
                            {JSON.stringify(step.result, null, 2)}
                          </pre>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Actions */}
            {agentWorkflow.actions.length > 0 && (
              <>
                <div className="flex items-center gap-2 mt-6 mb-3">
                  <Zap size={14} className="text-text-muted" />
                  <h3 className="text-xs font-semibold text-text-muted uppercase">Actions</h3>
                </div>
                <div className="space-y-2">
                  {agentWorkflow.actions.map((action, index) => {
                    const isExpanded = expandedActions.has(action.id);
                    
                    return (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "p-3 rounded-lg border transition-colors",
                          action.status === 'completed' && "border-green-500/30 bg-green-500/5",
                          action.status === 'in-progress' && "border-accent/30 bg-accent/5",
                          action.status === 'failed' && "border-red-500/30 bg-red-500/5",
                          action.status === 'pending' && "border-border bg-panel"
                        )}
                      >
                        <button
                          onClick={() => toggleAction(action.id)}
                          className="w-full flex items-start gap-3 text-left"
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {getActionIcon(action.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-text-primary uppercase">{action.type}</span>
                              <span className="text-xs text-text-muted truncate">{action.path}</span>
                            </div>
                          </div>
                          {isExpanded ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronRight size={14} className="text-text-muted" />}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (action.content || action.newContent) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-3 pt-3 border-t border-border overflow-hidden"
                            >
                              <pre className="text-xs text-text-secondary bg-black/30 rounded p-2 overflow-x-auto">
                                {action.content || action.newContent}
                              </pre>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      {agentWorkflow && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <FileText size={14} />
              <span>{agentWorkflow.steps.length} steps</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCode size={14} />
              <span>{agentWorkflow.pendingFileChanges.length || agentWorkflow.actions.length} files</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
