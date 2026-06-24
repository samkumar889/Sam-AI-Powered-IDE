'use client';

import { useState } from 'react';
import {
  useAppStore,
  type AgentStep,
  type AgentFileChange,
} from '@/store/useAppStore';
import {
  Play,
  RefreshCw,
  CheckCircle2,
  FileCode,
  Zap,
  ChevronDown,
  ChevronUp,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchCodebase } from '@/lib/codebase';

const generateId = () => Math.random().toString(36).slice(2, 11);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock: Generate files based on request
const generateFilesFromPlan = (request: string) => {
  const lowerRequest = request.toLowerCase();

  if (lowerRequest.includes('login') || lowerRequest.includes('auth') || lowerRequest.includes('modern') || lowerRequest.includes('web app')) {
    return [
      {
        path: 'samai-project/index.html',
        type: 'create' as const,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Web App - Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
    <div class="flex items-center justify-center min-h-screen p-4">
        <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div id="app"></div>
        </div>
    </div>
    <script src="app.js"></script>
</body>
</html>`,
      },
      {
        path: 'samai-project/app.js',
        type: 'create' as const,
        content: `// Modern Web App with Login System
class App {
  constructor() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    this.init();
  }

  init() {
    this.checkAuth();
  }

  checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.isLoggedIn = true;
      this.renderDashboard();
    } else {
      this.renderLogin();
    }
  }

  renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = \`
      <div class="p-8">
        <div class="text-center mb-8">
          <div class="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-user-shield text-white text-3xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p class="text-gray-500 mt-2">Sign in to your account</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" placeholder="you@example.com" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" id="password" placeholder="••••••••" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none">
          </div>
          <div class="flex items-center justify-between">
            <label class="flex items-center text-sm text-gray-600">
              <input type="checkbox" class="mr-2 accent-purple-600">
              Remember me
            </label>
            <a href="#" class="text-sm text-purple-600 hover:underline">Forgot password?</a>
          </div>
          <button id="loginBtn" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
            Sign In
          </button>
        </div>
        <div class="mt-6 text-center">
          <p class="text-gray-500">Don't have an account?</p>
          <button id="showRegister" class="text-purple-600 font-semibold hover:underline ml-1">Sign Up</button>
        </div>
      </div>
    \`;

    document.getElementById('loginBtn').addEventListener('click', () => this.login.bind(this));
    document.getElementById('showRegister').addEventListener('click', () => this.renderRegister());
  }

  renderRegister() {
    const app = document.getElementById('app');
    app.innerHTML = \`
      <div class="p-8">
        <div class="text-center mb-8">
          <div class="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-user-plus text-white text-3xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-800">Create Account</h1>
          <p class="text-gray-500 mt-2">Join us today</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" id="name" placeholder="John Doe" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" placeholder="you@example.com" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" id="password" placeholder="••••••••" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="••••••••" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none">
          </div>
          <button id="registerBtn" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
            Sign Up
          </button>
        </div>
        <div class="mt-6 text-center">
          <p class="text-gray-500">Already have an account?</p>
          <button id="showLogin" class="text-purple-600 font-semibold hover:underline ml-1">Sign In</button>
        </div>
      </div>
    \`;

    document.getElementById('registerBtn').addEventListener('click', () => this.register.bind(this)());
    document.getElementById('showLogin').addEventListener('click', () => this.renderLogin.bind(this));
  }

  register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (this.users.find(u => u.email === email)) {
      alert('Email already registered');
      return;
    }

    const newUser = { id: Date.now(), name, email, password };
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    alert('Registration successful!');
    this.renderLogin();
  }

  login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = this.users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert('Invalid credentials');
      return;
    }

    this.currentUser = user;
    this.isLoggedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.renderDashboard();
  }

  renderDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = \`
      <div class="p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">Welcome, \${this.currentUser.name}!</h2>
            <p class="text-gray-500">Dashboard</p>
          </div>
          <button id="logoutBtn" class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:opacity-90">
            <i class="fas fa-sign-out-alt mr-2"></i>Logout
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 font-medium">Profile</p>
                <p class="text-2xl font-bold text-gray-800">Complete</p>
              </div>
              <i class="fas fa-user-circle text-4xl text-blue-500"></i>
            </div>
          </div>
          <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-600 font-medium">Settings</p>
                <p class="text-2xl font-bold text-gray-800">Active</p>
              </div>
              <i class="fas fa-cog text-4xl text-purple-500"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Your Activity</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-white rounded-lg">
              <span class="text-gray-700">Login successful</span>
              <span class="text-sm text-gray-400">Just now</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded-lg">
              <span class="text-gray-700">Account created</span>
              <span class="text-sm text-gray-400">Today</span>
            </div>
          </div>
        </div>
      </div>
    \`;
    document.getElementById('logoutBtn').addEventListener('click', () => this.logout.bind(this));
  }

  logout() {
    this.currentUser = null;
    this.isLoggedIn = false;
    localStorage.removeItem('currentUser');
    this.renderLogin();
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
`,
      }
    ];
  }

  if (lowerRequest.includes('portfolio') || lowerRequest.includes('website')) {
    return [
      {
        path: 'samai-project/portfolio/index.html',
        type: 'create' as const,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">Portfolio</div>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home">
            <h1>Welcome to My Portfolio</h1>
            <p>Built by SAM AI</p>
        </section>
    </main>

    <script src="app.js"></script>
</body>
</html>`,
      },
      {
        path: 'samai-project/portfolio/style.css',
        type: 'create' as const,
        content: `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: white;
    min-height: 100vh;
}

header {
    padding: 1.5rem 2rem;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

.logo { font-size: 1.5rem; font-weight: 700; }

nav ul {
    list-style: none;
    display: flex;
    gap: 2rem;
}

nav a {
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.3s;
}

nav a:hover { color: #818cf8; }

#home {
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1rem;
}

#home h1 {
    font-size: 3.5rem;
    background: linear-gradient(135deg, #818cf8, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

#home p {
    font-size: 1.2rem;
    color: #94a3b8;
}`,
      },
      {
        path: 'samai-project/portfolio/app.js',
        type: 'create' as const,
        content: `document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded');
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth' });
        });
    });
});`,
      },
    ];
  }

  // Default: Create a simple component
  return [
    {
      path: 'samai-project/src/HelloWorld.js',
      type: 'create' as const,
      content: `export function HelloWorld() {
    return <div>Hello, World!</div>;
}`,
    },
  ];
};

export function AgentPanel() {
  const {
    agentTasks,
    addAgentTask,
    updateAgentTask,
    updateStepInTask,
    addTerminalLine,
    createFile,
    fileTree,
    addAgentTaskToHistory,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const runAutonomousAgent = async (request: string) => {
    const taskId = generateId();

    const initialSteps: AgentStep[] = [
      {
        id: 'step-1',
        name: 'Analyze Request',
        description: 'Understanding what you want to build...',
        status: 'pending',
      },
      {
        id: 'step-2',
        name: 'Search Codebase',
        description: 'Looking up relevant files and code...',
        status: 'pending',
      },
      {
        id: 'step-3',
        name: 'Create Plan',
        description: 'Outlining the files and changes needed...',
        status: 'pending',
      },
      {
        id: 'step-4',
        name: 'Modify Files',
        description: 'Creating and updating project files...',
        status: 'pending',
      },
      {
        id: 'step-5',
        name: 'Verify Changes',
        description: 'Checking if everything looks correct...',
        status: 'pending',
      },
      {
        id: 'step-6',
        name: 'Return Summary',
        description: 'Finalizing and summarizing the task...',
        status: 'pending',
      },
    ];

    const initialTask = {
      id: taskId,
      description: request,
      status: 'in-progress' as const,
      currentStepIndex: 0,
      steps: initialSteps,
      fileChanges: [],
      createdAt: new Date(),
    };

    addAgentTask(initialTask);
    setExpandedTask(taskId);

    // --- Step 1: Analyze Request ---
    await delay(500);
    updateStepInTask(taskId, 'step-1', { status: 'in-progress' });
    await delay(1200);
    updateStepInTask(taskId, 'step-1', {
      status: 'completed',
      result: { summary: `Detected request type: ${request.includes('website') ? 'Website/Portfolio' : 'Code generation'}` },
    });
    addTerminalLine({ type: 'info', content: '$ [Agent] Request analyzed successfully' });

    // --- Step 2: Search Codebase ---
    await delay(300);
    updateStepInTask(taskId, 'step-2', { status: 'in-progress' });
    updateAgentTask(taskId, { currentStepIndex: 1 });
    const searchResults = await searchCodebase(request);
    await delay(800);
    updateStepInTask(taskId, 'step-2', {
      status: 'completed',
      result: {
        filesSearched: searchResults.results?.length || 0,
        topResults: searchResults.results?.slice(0, 2),
      },
    });
    addTerminalLine({ type: 'info', content: `$ [Agent] Codebase searched: ${searchResults.results?.length || 0} results found` });

    // --- Step 3: Create Plan ---
    await delay(300);
    updateStepInTask(taskId, 'step-3', { status: 'in-progress' });
    updateAgentTask(taskId, { currentStepIndex: 2 });
    await delay(1500);
    const plannedFiles = generateFilesFromPlan(request);
    updateStepInTask(taskId, 'step-3', {
      status: 'completed',
      result: {
        filesToModify: plannedFiles.map((f) => f.path),
        plan: `Creating ${plannedFiles.length} files`,
      },
    });
    addTerminalLine({ type: 'info', content: `$ [Agent] Plan created: ${plannedFiles.length} files to create` });

    // --- Step 4: Modify Files ---
    await delay(300);
    updateStepInTask(taskId, 'step-4', { status: 'in-progress' });
    updateAgentTask(taskId, { currentStepIndex: 3 });

    const allFileChanges: AgentFileChange[] = [];

    for (const file of plannedFiles) {
      const fileChange: AgentFileChange = {
        ...file,
        status: 'in-progress' as const,
      };
      allFileChanges.push(fileChange);
      updateAgentTask(taskId, { fileChanges: [...allFileChanges] });
      await delay(600);

      // Create folder structure if needed - for demo, just create in root with filename
      const fileName = file.path.split('/').pop() || file.path;
      createFile(fileTree[0]?.id || null, fileName, 'file', file.content);

      // Mark file as completed
      const updatedFileChanges = allFileChanges.map((fc) =>
        fc.path === file.path
          ? { ...fc, status: 'completed' as const }
          : fc
      );
      updateAgentTask(taskId, { fileChanges: updatedFileChanges });
      addTerminalLine({ type: 'info', content: `$ [Agent] Created file: ${fileName}` });
      await delay(400);
    }

    updateStepInTask(taskId, 'step-4', { status: 'completed' });

    // --- Step 5: Verify Changes ---
    await delay(300);
    updateStepInTask(taskId, 'step-5', { status: 'in-progress' });
    updateAgentTask(taskId, { currentStepIndex: 4 });
    await delay(1000);
    updateStepInTask(taskId, 'step-5', {
      status: 'completed',
      result: {
        verificationPassed: true,
        checks: ['File structure valid', 'No syntax errors', 'All files created'],
      },
    });
    addTerminalLine({ type: 'info', content: '$ [Agent] All verifications passed' });

    // --- Step 6: Return Summary ---
    await delay(300);
    updateStepInTask(taskId, 'step-6', { status: 'in-progress' });
    updateAgentTask(taskId, { currentStepIndex: 5 });
    await delay(800);
    updateStepInTask(taskId, 'step-6', {
      status: 'completed',
      result: {
        summary: `Successfully completed the task: ${request}`,
        filesCreated: plannedFiles.length,
      },
    });

    // Mark entire task complete
    const finalTask = {
      id: taskId,
      description: request,
      status: 'completed' as const,
      currentStepIndex: 6,
      steps: initialSteps,
      fileChanges: [],
      createdAt: initialTask.createdAt,
      completedAt: new Date(),
    };
    updateAgentTask(taskId, {
      status: 'completed',
      completedAt: new Date(),
      currentStepIndex: 6,
    });
    addAgentTaskToHistory(finalTask);
    addTerminalLine({ type: 'info', content: '$ [Agent] Task completed' });
  };

  const handleRunTask = async () => {
    if (!input.trim()) return;
    await runAutonomousAgent(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {agentTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <Zap className="h-16 w-16 text-purple-500" />
            <h3 className="text-xl font-semibold text-white">
              Welcome to SAM AI Agent
            </h3>
            <p className="text-gray-400 max-w-sm">
              Tell the agent what to build. It will analyze, search, plan, and create files for you!
            </p>
          </div>
        ) : (
          agentTasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
            >
              {/* Task Header */}
              <button
                onClick={() =>
                  setExpandedTask(expandedTask === task.id ? null : task.id)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  ) : task.status === 'in-progress' ? (
                    <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                  ) : (
                    <Terminal className="h-6 w-6 text-gray-400" />
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-white truncate max-w-xs">
                      {task.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {task.status === 'completed'
                        ? `Completed • ${task.completedAt?.toLocaleTimeString()}`
                        : `${task.currentStepIndex + 1}/${task.steps.length} steps`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {expandedTask === task.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedTask === task.id && (
                <div className="border-t border-gray-700 p-4 space-y-4">
                  {/* Steps */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Workflow Steps
                    </h4>
                    {task.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border',
                          step.status === 'in-progress'
                            ? 'border-blue-500 bg-blue-500/10'
                            : step.status === 'completed'
                            ? 'border-green-500/30 bg-green-500/5'
                            : 'border-gray-700 bg-gray-800/50'
                        )}
                      >
                        <div className="flex-shrink-0">
                          {step.status === 'in-progress' ? (
                            <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
                          ) : step.status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-200">
                            {step.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {step.description}
                          </p>
                          {step.result && (
                            <pre className="mt-2 bg-gray-900 p-2 rounded text-xs text-gray-300 overflow-x-auto">
                              {JSON.stringify(step.result, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* File Changes */}
                  {task.fileChanges.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        Files Modified
                      </h4>
                      {task.fileChanges.map((file) => (
                        <div
                          key={file.path}
                          className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg"
                        >
                          <FileCode className="h-4 w-4 text-yellow-400" />
                          <span className="flex-1 truncate text-sm text-gray-300">
                            {file.path}
                          </span>
                          <span
                            className={cn(
                              'px-2 py-1 rounded text-xs font-medium',
                              file.type === 'create' && 'bg-green-500/20 text-green-300',
                              file.type === 'modify' && 'bg-blue-500/20 text-blue-300',
                              file.type === 'delete' && 'bg-red-500/20 text-red-300'
                            )}
                          >
                            {file.type}
                          </span>
                          {file.status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          ) : (
                            <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunTask()}
            placeholder="e.g., Build a portfolio website"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            onClick={handleRunTask}
            disabled={!input.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Play className="h-4 w-4" />
            Run
          </button>
        </div>
      </div>
    </div>
  );
}
