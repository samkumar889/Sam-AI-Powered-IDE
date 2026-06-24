'use client';

import { useAppStore, type Message, type FileNode } from '@/store/useAppStore';
import { Send, Bot, User, Copy, Check } from 'lucide-react';
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
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg text-xs text-gray-400">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-gray-200 transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-900 p-4 rounded-b-lg overflow-x-auto">
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
              className={`${className} bg-gray-800 px-1.5 py-0.5 rounded text-sm text-pink-300`}
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
            <blockquote className="border-l-4 border-purple-500 pl-4 my-2 text-gray-300 italic">
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

export function ChatPanel() {
  const {
    messages,
    addMessage,
    updateMessage,
    createFile,
    setActiveFile,
    fileTree,
    openFiles,
    addToConversationHistory,
  } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate sample AI response with Markdown and code blocks
  const generateAIResponse = (prompt: string, context: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('website') || lowerPrompt.includes('portfolio') || lowerPrompt.includes('web app')) {
      return `Perfect! Let's build a beautiful website for you! 🚀

Here's what I'll create:

## Files to Create
1. \`index.html\` - Main HTML structure
2. \`style.css\` - Beautiful styles with gradients
3. \`app.js\` - Interactive functionality

### Example Code
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to My Website!</h1>
        <p>Built with SAM AI</p>
        <button id="clickMe">Click Me!</button>
        <p id="counter">0</p>
    </div>
    <script src="app.js"></script>
</body>
</html>
\`\`\`

I'll also add interactive JavaScript and beautiful CSS! Let's get started! ✨`;
    }

    if (lowerPrompt.includes('react') || lowerPrompt.includes('component')) {
      return `Great choice! Let's build a React component! ⚛️

Here's a sample React component:
\`\`\`jsx
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
    </div>
  );
};

export default Counter;
\`\`\`

What kind of React component would you like to build?`;
    }

    if (lowerPrompt.includes('explain') || lowerPrompt.includes('what')) {
      return `I'm SAM AI, your AI coding assistant! 🤖

**What I can do:**
- Generate code for you
- Explain programming concepts
- Help debug issues
- Create complete projects

**Features:**
- 📝 Markdown rendering
- 💻 Code blocks with syntax highlighting
- 📋 Copy to clipboard
- ⚡ Streaming responses
- 🧠 Context awareness

Just ask me anything! How can I help you today?`;
    }

    // Default response with code example
    return `Got it! Let's work on that! 💻

Here's a quick example:
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('SAM AI');
\`\`\`

You asked: *"${prompt}"*

I can help you with:
1. Writing code
2. Debugging issues
3. Explaining concepts
4. Building complete projects

What would you like to do next?`;
  };

  const generateFilesForPrompt = (prompt: string): { name: string; content: string; type: 'file' | 'folder' }[] => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Check if user asks for a website/portfolio
    if (lowerPrompt.includes('website') || lowerPrompt.includes('portfolio') || lowerPrompt.includes('web app')) {
      return [
        {
          name: 'index.html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to My Website!</h1>
        <p>Built with SAM AI</p>
        <button id="clickMe">Click Me!</button>
        <p id="counter">0</p>
    </div>
    <script src="app.js"></script>
</body>
</html>`,
          type: 'file',
        },
        {
          name: 'style.css',
          content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 4rem;
    border-radius: 24px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

button {
    margin-top: 2rem;
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    border: none;
    border-radius: 50px;
    background: white;
    color: #667eea;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s;
}

button:hover {
    transform: translateY(-3px);
}`,
          type: 'file',
        },
        {
          name: 'app.js',
          content: `let count = 0;

document.getElementById('clickMe').addEventListener('click', () => {
    count++;
    document.getElementById('counter').textContent = count;
    console.log('Button clicked! Count:', count);
});`,
          type: 'file',
        },
      ];
    }

    // Default simple files
    return [
      {
        name: 'hello.txt',
        content: `Hello from SAM AI! You asked: ${prompt}`,
        type: 'file',
      }
    ];
  };

  const simulateStreaming = async (response: string, messageId: string) => {
    let currentContent = '';
    const chars = response.split('');
    
    for (let i = 0; i < chars.length; i++) {
      currentContent += chars[i];
      updateMessage(messageId, { content: currentContent });
      
      // Random delay for natural feel (faster for spaces)
      const delay = chars[i] === ' ' ? 20 : Math.random() * 30 + 10;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    updateMessage(messageId, { isStreaming: false });
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

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

    // Collect context from open files and file tree
    const fileContext = collectFileContext(fileTree);
    const openFilesInfo = openFiles.map(f => `\n- Open: ${f.path}`).join('');
    const context = `Current project files:${fileContext}\n\nOpen files:${openFilesInfo}`;

    // Create initial AI message
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    addMessage(aiMessage);
    addToConversationHistory(aiMessage);

    // Generate full response
    const fullResponse = generateAIResponse(currentPrompt, context);
    
    // Simulate streaming
    await simulateStreaming(fullResponse, aiMessageId);

    // Generate files if needed
    const generatedFiles = generateFilesForPrompt(currentPrompt);
    if (generatedFiles.length > 0) {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      for (let i = 0; i < generatedFiles.length; i++) {
        const file = generatedFiles[i];
        createFile(fileTree[0]?.id || null, file.name, file.type, file.content);
        await delay(600);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 bg-[#111827] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-400" />
          <h2 className="font-semibold text-gray-200">SAM AI</h2>
        </div>
        <span className="text-xs text-gray-500">
          {messages.length} messages
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a]">
        {messages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'
              }`}
            >
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600/20 text-blue-100'
                  : 'bg-gray-800/50 text-gray-100'
              }`}
            >
              <div className="text-sm">
                {msg.role === 'assistant' ? (
                  <MarkdownMessage content={msg.content} />
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
                {msg.isStreaming && (
                  <span className="inline-block w-1.5 h-5 bg-purple-400 ml-0.5 align-middle animate-pulse" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && !messages.some(m => m.isStreaming) && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-600">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-gray-800/50 text-gray-100 rounded-lg p-3">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-800 bg-[#111827]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask SAM AI anything..."
            disabled={isTyping}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
