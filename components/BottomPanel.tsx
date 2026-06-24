'use client';

import { useAppStore } from '@/store/useAppStore';
import { Terminal, FileText, AlertCircle, X, RotateCcw, Bot, Copy, Check, Cpu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import TerminalAgentPanel from './TerminalAgentPanel';

// Mock command execution
const executeMockCommand = async (
  command: string,
  onOutput: (line: string, type: 'output' | 'error' | 'info') => void
) => {
  const lowerCmd = command.toLowerCase().trim();
  
  // Simple built-in commands
  if (lowerCmd === 'help') {
    onOutput('Available commands: help, clear, ls, pwd, echo, node, build', 'info');
    return { success: true };
  }
  
  if (lowerCmd === 'clear') {
    return { clearTerminal: true, success: true };
  }
  
  if (lowerCmd === 'ls') {
    onOutput('index.html  style.css  app.js  src/', 'output');
    return { success: true };
  }
  
  if (lowerCmd === 'pwd') {
    onOutput('/home/samai/samai-project', 'output');
    return { success: true };
  }
  
  if (lowerCmd.startsWith('echo ')) {
    onOutput(command.slice(5), 'output');
    return { success: true };
  }
  
  // Example: Simulate a build command that takes time and outputs logs
  if (lowerCmd === 'build') {
    onOutput('Starting build process...', 'info');
    await new Promise(r => setTimeout(r, 500));
    onOutput('✓ Compiling TypeScript...', 'output');
    await new Promise(r => setTimeout(r, 800));
    onOutput('✓ Bundling assets...', 'output');
    await new Promise(r => setTimeout(r, 600));
    onOutput('Build completed successfully in 1.9s!', 'info');
    return { success: true };
  }
  
  // Example: Simulate an error case
  if (lowerCmd.includes('fail') || lowerCmd.includes('error')) {
    onOutput('Error: Something went wrong!', 'error');
    onOutput('Traceback (most recent call last):', 'error');
    onOutput('  File "<stdin>", line 1', 'error');
    onOutput('RuntimeError: Example error for debugging', 'error');
    return { success: false, error: 'RuntimeError' };
  }
  
  // Default - command not found
  onOutput(`Command not found: ${command}`, 'error');
  return { success: false, error: 'CommandNotFound' };
};

// Error detection keywords
const ERROR_KEYWORDS = ['error', 'fail', 'failed', 'exception', 'traceback', 'fatal'];

export function BottomPanel() {
  const {
    bottomPanelActiveTab,
    setBottomPanelActiveTab,
    bottomPanelVisible,
    toggleBottomPanel,
    terminal,
    addTerminalLine,
    setTerminalRunning,
    setTerminalStatus,
    clearTerminal,
  } = useAppStore();
  
  const [input, setInput] = useState('');
  const [showDebugButton, setShowDebugButton] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'terminal' as const, icon: Terminal, label: 'Terminal' },
    { id: 'agent' as const, icon: Cpu, label: 'Terminal Agent' },
    { id: 'output' as const, icon: FileText, label: 'Output' },
    { id: 'logs' as const, icon: AlertCircle, label: 'Logs' },
  ];

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminal.lines]);

  // Handle command execution
  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() && !terminal.isRunning) {
      const command = input.trim();
      
      // Add input line
      addTerminalLine({ type: 'input', content: `$ ${command}` });
      setInput('');
      setTerminalRunning(true);
      setTerminalStatus('running');
      setShowDebugButton(false);
      
      // Execute command
      let hasError = false;
      
      const onOutput = (text: string, type: 'output' | 'error' | 'info') => {
        addTerminalLine({ type, content: text });
        if (type === 'error' || ERROR_KEYWORDS.some(k => text.toLowerCase().includes(k))) {
          hasError = true;
        }
      };
      
      const result = await executeMockCommand(command, onOutput);
      
      if (result.clearTerminal) {
        clearTerminal();
      }
      
      setTerminalRunning(false);
      setTerminalStatus(result.success ? 'success' : 'error');
      
      if (!result.success || hasError) {
        setShowDebugButton(true);
      }
    }
  };
  
  // Copy line to clipboard
  const handleCopyLine = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // AI Debug assistance (mock)
  const handleDebug = () => {
    addTerminalLine({ type: 'info', content: '🤖 SAM AI is analyzing the error...' });
    setTimeout(() => {
      addTerminalLine({ type: 'info', content: '💡 Suggested fix: Check your file paths and ensure all dependencies are installed.' });
      setShowDebugButton(false);
    }, 1500);
  };

  if (!bottomPanelVisible) return null;

  return (
    <div className="border-t border-gray-700 bg-[#0f172a] flex flex-col h-64">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-[#1e293b]">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setBottomPanelActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-r border-gray-700 text-sm transition-colors ${
                bottomPanelActiveTab === tab.id
                  ? 'bg-[#0f172a] text-gray-100 border-t-2 border-t-purple-500'
                  : 'text-gray-400 hover:bg-[#0f172a] hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.id === 'terminal' && terminal.isRunning && (
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-2">
          {showDebugButton && (
            <button
              onClick={handleDebug}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            >
              <Bot className="w-3 h-3" />
              Debug with AI
            </button>
          )}
          <button
            onClick={() => clearTerminal()}
            className="p-2 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
            title="Clear Terminal"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={toggleBottomPanel}
            className="p-2 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {bottomPanelActiveTab === 'terminal' && (
          <div className="h-full flex flex-col">
            <div
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-3 font-mono text-sm"
            >
              {terminal.lines.map((line) => (
                <div
                  key={line.id}
                  className={cn(
                    'flex items-start gap-2 group',
                    line.type === 'input' && 'text-blue-400',
                    line.type === 'output' && 'text-gray-200',
                    line.type === 'error' && 'text-red-400',
                    line.type === 'info' && 'text-yellow-400',
                    line.type === 'warning' && 'text-orange-400'
                  )}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopyLine(line.content, line.id)}
                      className="text-gray-500 hover:text-gray-300"
                    >
                      {copiedId === line.id ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </span>
                  <span className="flex-1 whitespace-pre-wrap">{line.content}</span>
                </div>
              ))}
              
              {/* Running indicator */}
              {terminal.isRunning && (
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="animate-pulse">●</span>
                  <span>Executing...</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 p-2 border-t border-gray-700 bg-[#1e293b]">
              <span className="text-green-400 font-mono">$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                disabled={terminal.isRunning}
                className={cn(
                  'flex-1 bg-transparent text-gray-100 outline-none font-mono text-sm',
                  terminal.isRunning && 'text-gray-500 cursor-not-allowed'
                )}
                placeholder={terminal.isRunning ? 'Command running...' : 'Type a command...'}
                autoFocus
              />
            </div>
          </div>
        )}
        {bottomPanelActiveTab === 'agent' && (
          <div className="h-full flex flex-col overflow-y-auto">
            <TerminalAgentPanel />
            <div className="flex-1 bg-[#0f172a] p-3">
              <div className="text-xs text-gray-500">Agent actions will appear here...</div>
            </div>
          </div>
        )}
        {bottomPanelActiveTab === 'output' && (
          <div className="p-3 text-gray-400 text-sm">Output will appear here...</div>
        )}
        {bottomPanelActiveTab === 'logs' && (
          <div className="p-3 text-gray-400 text-sm">Logs will appear here...</div>
        )}
      </div>
    </div>
  );
}
