'use client';

import { useAppStore, type Message, type FileNode, type AgentFileChange } from '@/store/useAppStore';
import { Send, Bot, User, Copy, Check, FileText, Code, Folder, Play, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Helper to collect all file contents for context
const collectFileContext = (nodes: FileNode[]): string => {
  let context = '';
  const traverse = (items: FileNode[]) => {
    for (const node of items) {
      if (node.type === 'file' && node.content) {
        context += `\n--- File: ${node.path} ---\n${node.content}\n`;
      }
      if (node.children) {
        traverse(node.children);
      }
    }
  };
  traverse(nodes);
  return context;
};

// Code block component with copy button
const CodeBlock = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  const handleCopy = async () => {
    if (typeof children === 'string') {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative my-2">
      <div className="flex items-center justify-between bg-bg-elevated-1 px-4 py-2 rounded-t-lg text-xs text-text-muted">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-text-secondary transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-bg-elevated-0 p-4 rounded-b-lg overflow-x-auto">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

// Markdown renderer
const MarkdownMessage = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <CodeBlock className={className} {...props}>{children}</CodeBlock>
          ) : (
            <code
              className={`${className} bg-bg-elevated-1 px-1.5 py-0.5 rounded text-sm text-accent-primary`}
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        ul({ children }) {
          return <ul className="list-disc pl-5 mb-2">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-5 mb-2">{children}</ol>;
        },
        li({ children }) {
          return <li className="mb-1">{children}</li>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-accent-secondary pl-4 my-2 text-text-muted italic">
              {children}
            </blockquote>
          );
        },
        h1({ children }) {
          return <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-lg font-semibold mb-2 mt-3">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-base font-semibold mb-1 mt-2">{children}</h3>;
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

// Step Component for Planning
interface Step {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

// File Change Preview Component
interface FileChangePreviewProps {
  changes: AgentFileChange[];
  onApprove: () => void;
  onReject: () => void;
}

const FileChangePreview = ({ changes, onApprove, onReject }: FileChangePreviewProps) => {
  return (
    <div className="mt-3 border border-border-default rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-elevated-1 border-b border-border-default">
        <h4 className="text-sm font-medium text-text-secondary flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Proposed Changes ({changes.length})
        </h4>
        <div className="flex gap-2">
          <button
            onClick={onReject}
            className="px-3 py-1 text-xs border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors"
          >
            <XCircle className="w-3 h-3 inline mr-1" />
            Reject
          </button>
          <button
            onClick={onApprove}
            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            <CheckCircle className="w-3 h-3 inline mr-1" />
            Approve All
          </button>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {changes.map((change, i) => (
          <div key={i} className="p-3 border-b border-border-default last:border-b-0">
            <div className="flex items-center gap-2 mb-2">
              {change.type === 'create' ? (
                <span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">+ Create</span>
              ) : change.type === 'modify' ? (
                <span className="px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">~ Modify</span>
              ) : (
                <span className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">- Delete</span>
              )}
              <span className="text-sm text-text-secondary font-mono">{change.path}</span>
            </div>
            {change.content && (
              <pre className="text-xs bg-bg-elevated-0 p-2 rounded overflow-x-auto max-h-24 overflow-y-auto">
                <code>{change.content}</code>
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export function AgentChatPanel() {
  const {
    messages,
    addMessage,
    updateMessage,
    createFile,
    setActiveFile,
    fileTree,
    openFiles,
    addToConversationHistory,
    agentWorkflow,
    setAgentWorkflow,
    updateAgentWorkflowStatus,
    addAgentStep,
    updateAgentStep,
    addAgentAction,
    updateAgentAction,
    startAgentWorkflow,
    addPendingFileChange,
    removePendingFileChange,
    applyAllPendingChanges,
    discardAllPendingChanges,
    v2RightPanelVisible,
    toggleV2RightPanel,
    setV2LeftSidebarActiveTab,
  } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [pendingChanges, setPendingChanges] = useState<AgentFileChange[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, steps, pendingChanges]);

  // Generate AI Response with Planning
  const generateAIResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
      return "Hi there! I'm SAM AI's autonomous agent. How can I help you today?";
    }
    if (lowerPrompt.includes('build') || lowerPrompt.includes('create') || lowerPrompt.includes('make')) {
      return "Perfect! I'll help you build that. Let me first plan what needs to be done, then I'll show you the changes before applying them!";
    }
    return "I understand. Let's work through this step by step.";
  };

  // Generate Plan Steps based on Prompt
  const generatePlanSteps = (prompt: string): Step[] => {
    const lowerPrompt = prompt.toLowerCase();
    let plan: Step[] = [
      { id: '1', title: 'Analyze Request', description: 'Understanding your requirements', status: 'pending' },
    ];

    if (lowerPrompt.includes('react') || lowerPrompt.includes('component')) {
      plan = [
        { id: '1', title: 'Analyze Request', description: 'Understanding your React component requirements', status: 'pending' },
        { id: '2', title: 'Plan Architecture', description: 'Determining component structure and props', status: 'pending' },
        { id: '3', title: 'Write Component Code', description: 'Creating the React component with state and hooks', status: 'pending' },
        { id: '4', title: 'Add Styles', description: 'Adding CSS/Tailwind classes', status: 'pending' },
        { id: '5', title: 'Review Changes', description: 'Show you the changes for approval', status: 'pending' },
      ];
    } else if (lowerPrompt.includes('website') || lowerPrompt.includes('web') || lowerPrompt.includes('html')) {
      plan = [
        { id: '1', title: 'Analyze Request', description: 'Understanding your website requirements', status: 'pending' },
        { id: '2', title: 'Create HTML Structure', description: 'Building the semantic HTML', status: 'pending' },
        { id: '3', title: 'Design CSS', description: 'Adding beautiful styles and layout', status: 'pending' },
        { id: '4', title: 'Add JavaScript', description: 'Implementing interactive functionality', status: 'pending' },
        { id: '5', title: 'Review Changes', description: 'Show you all the changes', status: 'pending' },
      ];
    } else {
      plan = [
        { id: '1', title: 'Analyze Request', description: 'Understanding what you need', status: 'pending' },
        { id: '2', title: 'Plan Implementation', description: 'Creating a plan of action', status: 'pending' },
        { id: '3', title: 'Generate Code', description: 'Writing the necessary files', status: 'pending' },
        { id: '4', title: 'Review Changes', description: 'Show you the changes for approval', status: 'pending' },
      ];
    }
    return plan;
  };

  // Generate File Changes based on Prompt
  const generateFileChanges = (prompt: string): AgentFileChange[] => {
    const lowerPrompt = prompt.toLowerCase();
    let changes: AgentFileChange[] = [];
    if (lowerPrompt.includes('react') || lowerPrompt.includes('component')) {
      changes = [
        {
          path: 'samai-project/MyComponent.tsx',
          type: 'create',
          content: `'use client';

import { useState } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-bg-elevated-1 rounded-lg border border-border-default">
      <h2 className="text-xl font-bold text-text-primary mb-4">My Component</h2>
      <p className="text-text-secondary mb-4">Count: {count}</p>
      <div className="flex gap-2">
        <button 
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/80 text-white rounded transition-colors"
        >
          Increment
        </button>
        <button 
          onClick={() => setCount(c => c - 1)}
          className="px-4 py-2 border border-border-default hover:bg-bg-elevated-0 text-text-secondary rounded transition-colors"
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
`,
          status: 'pending',
        },
      ];
    } else if (lowerPrompt.includes('website') || lowerPrompt.includes('web') || lowerPrompt.includes('html')) {
      changes = [
        {
          path: 'samai-project/index.html',
          type: 'create',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAM AI Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 Welcome to SAM AI</h1>
            <p>Your AI-powered development companion</p>
        </header>
        <main>
            <div class="card">
                <h2>Build Faster</h2>
                <p>AI helps you write code quickly</p>
            </div>
            <div class="card">
                <h2>Learn Smarter</h2>
                <p>Get explanations as you go</p>
            </div>
            <div class="card">
                <h2>Deploy Instantly</h2>
                <p>One-click deployments</p>
            </div>
        </main>
    </div>
    <script src="app.js"></script>
</body>
</html>
`,
          status: 'pending',
        },
        {
          path: 'samai-project/style.css',
          type: 'create',
          content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    min-height: 100vh;
    color: white;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
}

header {
    text-align: center;
    margin-bottom: 4rem;
}

header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

header p {
    font-size: 1.25rem;
    opacity: 0.9;
}

main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.card h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.card p {
    opacity: 0.85;
}
`,
          status: 'pending',
        },
        {
          path: 'samai-project/app.js',
          type: 'create',
          content: `console.log('Hello from SAM AI! 🚀');

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
});
`,
          status: 'pending',
        },
      ];
    } else {
      changes = [
        {
          path: 'samai-project/output.txt',
          type: 'create',
          content: `You asked: ${prompt}

Created by SAM AI Agent System`,
          status: 'pending',
        },
      ];
    }
    return changes;
  };

  // Execute Plan Steps
  const executePlan = async (planSteps: Step[], fileChanges: AgentFileChange[]) => {
    setSteps(planSteps);
    setPendingChanges([]);
    
    for (let i = 0; i < planSteps.length; i++) {
      // Update current step to in progress
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'in_progress' } : s
      ));
      
      await new Promise(r => setTimeout(r, 1000));
      
      // Complete current step
      setSteps(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'completed' } : s
      ));

      // If last step, show the file changes
      if (i === planSteps.length - 1) {
        setPendingChanges(fileChanges);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    addToConversationHistory(userMessage);
    const currentPrompt = input;
    setInput('');
    setIsTyping(true);
    setSteps([]);
    setPendingChanges([]);

    // Create AI message
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    addMessage(aiMessage);

    // Simulate streaming response
    const fullResponse = generateAIResponse(currentPrompt);
    let currentContent = '';
    const chars = fullResponse.split('');
    for (let i = 0; i < chars.length; i++) {
      currentContent += chars[i];
      updateMessage(aiMessageId, { content: currentContent });
      const delay = chars[i] === ' ' ? 20 : Math.random() * 30 + 10;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    updateMessage(aiMessageId, { isStreaming: false });
    setIsTyping(false);

    // Generate plan and file changes
    const planSteps = generatePlanSteps(currentPrompt);
    const fileChanges = generateFileChanges(currentPrompt);
    
    // Execute plan
    await executePlan(planSteps, fileChanges);
  };

  const handleApproveChanges = () => {
    pendingChanges.forEach(change => {
      createFile(fileTree[0]?.id || null, change.path.split('/').pop() || 'file.txt', 'file', change.content);
    });
    setPendingChanges([]);
    setSteps([]);
    
    const successMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '✅ All changes applied successfully! Your files have been created.',
      timestamp: new Date(),
    };
    addMessage(successMessage);
  };

  const handleRejectChanges = () => {
    setPendingChanges([]);
    setSteps([]);
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Changes rejected. Let me know what you want to change!',
      timestamp: new Date(),
    };
    addMessage(message);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border-default bg-bg-elevated-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent-primary" />
          <h2 className="font-semibold text-text-primary">SAM AI Agent</h2>
        </div>
        <span className="text-xs text-text-muted">Autonomous Mode</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-elevated-0">
        {messages.length === 0 && (
          <div className="text-center text-text-muted py-10">
            <Bot className="w-12 h-12 mx-auto mb-4 text-accent-primary/50" />
            <h3 className="font-medium text-text-secondary mb-2">Welcome to Agent Mode</h3>
            <p className="text-sm">Ask me to build something, and I'll plan it step-by-step!</p>
          </div>
        )}
        
        {messages.map((msg: Message) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-accent-primary'}`}>
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`max-w-[85%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-blue-600/20 text-blue-100' : 'bg-bg-elevated-1 text-text-primary'}`}>
              <div className="text-sm">
                {msg.role === 'assistant' ? <MarkdownMessage content={msg.content} /> : <div className="whitespace-pre-wrap">{msg.content}</div>}
                {msg.isStreaming && <span className="inline-block w-1.5 h-5 bg-accent-primary ml-0.5 align-middle animate-pulse" />}
              </div>
            </div>
          </div>
        ))}

        {/* Steps Display */}
        {steps.length > 0 && (
          <div className="bg-bg-elevated-1 rounded-lg p-4 border border-border-default">
            <h4 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
              <Play className="w-4 h-4" />
              Execution Plan
            </h4>
            <div className="space-y-2">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-2 text-sm">
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : step.status === 'in_progress' ? (
                    <div className="w-4 h-4 rounded-full border-2 border-accent-primary border-t-transparent animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-border-default flex-shrink-0" />
                  )}
                  <span className={step.status === 'completed' ? 'text-text-muted line-through' : 'text-text-secondary'}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Changes Preview */}
        {pendingChanges.length > 0 && (
          <FileChangePreview changes={pendingChanges} onApprove={handleApproveChanges} onReject={handleRejectChanges} />
        )}

        {isTyping && !messages.some(m => m.isStreaming) && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-bg-elevated-1 rounded-lg p-3">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border-default bg-bg-elevated-1">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask agent to build something..."
            disabled={isTyping}
            className="flex-1 bg-bg-elevated-0 border border-border-default rounded-lg px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="bg-accent-primary hover:bg-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
