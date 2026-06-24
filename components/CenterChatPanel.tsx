'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Copy, 
  Check, 
  Bot, 
  User as UserIcon,
  Sparkles,
  Brain,
  Code,
  ChevronDown,
  X,
  FileText,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { useAppStore, type Message as StoreMessage } from '@/store/useAppStore';
import { SUPPORTED_MODELS, type ModelId } from '@/lib/aiModels';

// Component to safely render time without hydration errors
function SafeTime({ date }: { date: Date }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="text-xs text-text-muted mt-1">...</span>;
  }

  return (
    <p className="text-xs text-text-muted mt-1">
      {date.toLocaleTimeString()}
    </p>
  );
}

interface Tab {
  id: string;
  label: string;
  active: boolean;
}

export default function CenterChatPanel() {
  const { 
    messages, 
    addMessage, 
    updateMessage, 
    selectedModel, 
    setSelectedModel 
  } = useAppStore();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentMode, setAgentMode] = useState<'chat' | 'agent'>('chat');
  const [showReasoning, setShowReasoning] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const tabs: Tab[] = [
    { id: 'chat', label: 'Chat', active: true },
    { id: 'agent', label: 'Agent', active: false },
    { id: 'files', label: 'Files', active: false },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real streaming function
  const handleStreaming = async (userInput: string, allMessages: StoreMessage[]) => {
    const assistantMessageId = (Date.now() + 1).toString();
    addMessage({
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: allMessages,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let currentContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;

          const data = trimmedLine.slice(5).trim();
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              currentContent += `\n\n**Error:** ${parsed.error}`;
              updateMessage(assistantMessageId, { content: currentContent });
              break;
            }
            if (parsed.content) {
              currentContent += parsed.content;
              updateMessage(assistantMessageId, { content: currentContent });
            }
            if (parsed.done) {
              break;
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      updateMessage(assistantMessageId, { 
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      updateMessage(assistantMessageId, { isStreaming: false });
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: StoreMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    addMessage(userMessage);
    setInput('');
    setIsTyping(true);

    handleStreaming(input, newMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-sidebar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "px-4 py-1.5 text-sm rounded-lg transition-colors",
              tab.active
                ? "bg-sidebar-active text-text-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover"
            )}
          >
            {tab.label}
          </button>
        ))}
        
        <div className="ml-auto flex items-center gap-2">
          {/* Agent Mode Toggle */}
          <button
            onClick={() => setAgentMode(agentMode === 'chat' ? 'agent' : 'chat')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
              agentMode === 'agent'
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover"
            )}
          >
            <Brain size={14} />
            <span>Agent Mode</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex gap-4",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
              )}

              <div
                className={cn(
                  "flex-1 max-w-[85%]",
                  message.role === 'user' ? 'flex flex-col items-end' : ''
                )}
              >
                {/* Message Content */}
                <div
                  className={cn(
                    "p-4 rounded-lg",
                    message.role === 'user'
                      ? "bg-accent text-white"
                      : "bg-panel border border-border"
                  )}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline ? (
                              <div className="relative group">
                                <pre className="bg-sidebar border border-border rounded-lg p-4 overflow-x-auto">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                                <button
                                  onClick={() => copyToClipboard(String(children))}
                                  className="absolute top-2 right-2 p-1.5 bg-sidebar border border-border rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Copy size={14} className="text-text-secondary" />
                                </button>
                              </div>
                            ) : (
                              <code className="bg-sidebar px-1.5 py-0.5 rounded text-accent" {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-xs text-text-muted mt-1 flex items-center gap-2">
                  <SafeTime date={message.timestamp} />
                  {message.isStreaming && <span className="animate-pulse">●</span>}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sidebar-active flex items-center justify-center">
                  <UserIcon size={18} className="text-text-primary" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && !messages.some(m => m.isStreaming) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-accent rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-accent rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-accent rounded-full"
                />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-sidebar p-4">
        <div className="max-w-4xl mx-auto">
          {/* Model Selector */}
          <div className="flex items-center gap-2 mb-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelId)}
              className="px-3 py-1.5 bg-panel border border-border rounded-lg text-sm text-text-primary focus:border-accent outline-none"
            >
              {SUPPORTED_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            
            <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors">
              <RefreshCw size={16} />
            </button>
          </div>

          {/* Input Box */}
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask SAM AI anything... (Shift+Enter for new line)"
              className="w-full px-4 py-3 pr-24 bg-panel border border-border rounded-lg text-text-primary placeholder:text-text-muted resize-none focus:border-accent outline-none transition-colors"
              rows={3}
            />
            
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors">
                <Paperclip size={18} />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-text-muted mt-2">
            Press <kbd className="px-1.5 py-0.5 bg-panel rounded">Enter</kbd> to send,{' '}
            <kbd className="px-1.5 py-0.5 bg-panel rounded">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
