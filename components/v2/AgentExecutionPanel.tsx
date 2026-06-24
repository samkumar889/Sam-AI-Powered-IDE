'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Terminal,
  AlertCircle,
  Info,
  FileCode,
} from 'lucide-react';
import type { AgentTask, AgentLog, AgentState } from '@/lib/agent-engine';

interface AgentExecutionPanelProps {
  task?: AgentTask | null;
  onExecute?: (prompt: string) => Promise<void>;
  onAbort?: () => void;
}

const stateColors: Record<AgentState, string> = {
  planning: 'text-yellow-400 bg-yellow-400/10',
  executing: 'text-blue-400 bg-blue-400/10',
  waiting: 'text-purple-400 bg-purple-400/10',
  completed: 'text-green-400 bg-green-400/10',
  failed: 'text-red-400 bg-red-400/10',
};

const stateIcons: Record<AgentState, React.ElementType> = {
  planning: Clock,
  executing: FileCode,
  waiting: RotateCcw,
  completed: CheckCircle,
  failed: XCircle,
};

const logTypeIcons: Record<string, React.ElementType> = {
  'tool-call': FileCode,
  'error': XCircle,
  'info': Info,
  'success': CheckCircle,
};

const logTypeColors: Record<string, string> = {
  'tool-call': 'text-blue-400',
  'error': 'text-red-400',
  'info': 'text-gray-400',
  'success': 'text-green-400',
};

export function AgentExecutionPanel({ task, onExecute, onAbort }: AgentExecutionPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [task?.logs]);

  const handleExecute = async () => {
    if (!prompt.trim() || !onExecute) return;
    setIsExecuting(true);
    try {
      await onExecute(prompt);
    } finally {
      setIsExecuting(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border-default bg-bg-elevated-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-accent-primary" />
          <div>
            <h2 className="font-semibold text-text-primary text-sm">Agent Execution</h2>
            {task && (
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`px-1.5 py-0.5 text-xs rounded font-medium flex items-center gap-1 ${
                    stateColors[task.state]
                  }`}
                >
                  {(() => {
                    const Icon = stateIcons[task.state];
                    return <Icon className="w-3 h-3" />;
                  })()}
                  {task.state.toUpperCase()}
                </span>
                {task.currentStep !== undefined && (
                  <span className="text-xs text-text-muted">
                    Step {task.currentStep + 1}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {isExecuting && onAbort && (
          <button
            onClick={onAbort}
            className="px-3 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors flex items-center gap-1"
          >
            <Square className="w-3 h-3" />
            Abort
          </button>
        )}
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs bg-bg-elevated-0">
        {!task?.logs?.length && (
          <div className="text-center text-text-muted py-10">
            <Terminal className="w-8 h-8 mx-auto mb-3 text-text-muted/50" />
            <p>Agent execution logs will appear here</p>
          </div>
        )}
        {task?.logs?.map((log: AgentLog, idx: number) => {
          const Icon = logTypeIcons[log.type] || Info;
          return (
            <div
              key={idx}
              className="flex gap-2 items-start p-2 rounded hover:bg-bg-elevated-1/50"
            >
              <span className="text-text-muted/70 flex-shrink-0">
                [{formatTime(log.timestamp)}]
              </span>
              <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${logTypeColors[log.type]}`} />
              <div className="flex-1">
                <span className={`${logTypeColors[log.type]}`}>
                  {log.message}
                </span>
                {log.details && (
                  <pre className="mt-1 p-2 bg-bg-elevated-1 rounded text-[10px] overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {task?.state === 'failed' && (
        <div className="p-3 border-t border-red-500/30 bg-red-500/5">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 text-sm font-medium">{task.error}</p>
              {task.suggestion && (
                <p className="text-red-300/70 text-xs mt-1">{task.suggestion}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border-default bg-bg-elevated-1">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isExecuting && handleExecute()}
            placeholder="Enter task for agent..."
            disabled={isExecuting}
            className="flex-1 bg-bg-elevated-0 border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary disabled:opacity-50"
          />
          <button
            onClick={handleExecute}
            disabled={isExecuting || !prompt.trim() || !onExecute}
            className="bg-accent-primary hover:bg-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 text-sm"
          >
            <Play className="w-3.5 h-3.5" />
            Execute
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgentExecutionPanel;
