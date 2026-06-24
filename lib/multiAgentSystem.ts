
export type AgentType = 
  | 'architect' 
  | 'frontend' 
  | 'backend' 
  | 'devops' 
  | 'qa' 
  | 'security' 
  | 'codeReview' 
  | 'browserAutomation' 
  | 'database' 
  | 'master';

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  icon: string;
  color: string;
  capabilities: string[];
}

export interface AgentTask {
  id: string;
  agentType: AgentType;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
  createdAt: number;
  completedAt?: number;
}

export interface AgentConversation {
  id: string;
  role: 'user' | 'agent';
  agentType?: AgentType;
  content: string;
  timestamp: number;
}

export const AGENTS: Agent[] = [
  {
    id: 'architect',
    type: 'architect',
    name: 'Architect Agent',
    description: 'Designs system architecture and project structure',
    icon: '🏗️',
    color: 'bg-purple-500',
    capabilities: ['System Design', 'Architecture Planning', 'Tech Stack Selection', 'Project Structure']
  },
  {
    id: 'frontend',
    type: 'frontend',
    name: 'Frontend Agent',
    description: 'Builds modern, responsive user interfaces',
    icon: '🎨',
    color: 'bg-blue-500',
    capabilities: ['React', 'Vue', 'Tailwind', 'UI/UX Design', 'Responsive Layouts']
  },
  {
    id: 'backend',
    type: 'backend',
    name: 'Backend Agent',
    description: 'Develops APIs, business logic, and server-side code',
    icon: '⚙️',
    color: 'bg-green-500',
    capabilities: ['Node.js', 'Express', 'API Design', 'Business Logic', 'Authentication']
  },
  {
    id: 'devops',
    type: 'devops',
    name: 'DevOps Agent',
    description: 'Handles deployment, CI/CD, and infrastructure',
    icon: '🚀',
    color: 'bg-orange-500',
    capabilities: ['Docker', 'Kubernetes', 'CI/CD', 'Vercel', 'Netlify', 'Railway']
  },
  {
    id: 'qa',
    type: 'qa',
    name: 'QA Agent',
    description: 'Tests and validates the application',
    icon: '✅',
    color: 'bg-pink-500',
    capabilities: ['Test Writing', 'Validation', 'Bug Detection', 'Quality Assurance']
  },
  {
    id: 'security',
    type: 'security',
    name: 'Security Agent',
    description: 'Audits code for security vulnerabilities',
    icon: '🔒',
    color: 'bg-red-500',
    capabilities: ['Security Audits', 'Vulnerability Detection', 'Best Practices']
  },
  {
    id: 'codeReview',
    type: 'codeReview',
    name: 'Code Review Agent',
    description: 'Reviews code for quality, performance, and readability',
    icon: '📝',
    color: 'bg-yellow-500',
    capabilities: ['Code Quality', 'Performance', 'Readability', 'Best Practices']
  },
  {
    id: 'browserAutomation',
    type: 'browserAutomation',
    name: 'Browser Automation Agent',
    description: 'Automates browser interactions and testing',
    icon: '🌐',
    color: 'bg-cyan-500',
    capabilities: ['Playwright', 'Puppeteer', 'E2E Testing', 'Browser Automation']
  },
  {
    id: 'database',
    type: 'database',
    name: 'Database Agent',
    description: 'Manages databases, schemas, and queries',
    icon: '🗄️',
    color: 'bg-indigo-500',
    capabilities: ['Prisma', 'MySQL', 'PostgreSQL', 'SQL', 'Schema Design']
  },
  {
    id: 'master',
    type: 'master',
    name: 'Master Agent',
    description: 'Coordinates all agents and manages the workflow',
    icon: '🤖',
    color: 'bg-emerald-500',
    capabilities: ['Orchestration', 'Task Delegation', 'Workflow Management']
  }
];

class MultiAgentSystem {
  private tasks: AgentTask[] = [];
  private conversations: AgentConversation[] = [];
  
  addTask(task: Omit<AgentTask, 'id' | 'createdAt' | 'status'>) {
    const newTask: AgentTask = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: 'pending'
    };
    this.tasks.push(newTask);
    return newTask;
  }
  
  addMessage(message: Omit<AgentConversation, 'id' | 'timestamp'>) {
    const newMessage: AgentConversation = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    this.conversations.push(newMessage);
    return newMessage;
  }
  
  getTasks() {
    return this.tasks;
  }
  
  getConversations() {
    return this.conversations;
  }
  
  async processTask(taskId: string) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return null;
    
    task.status = 'in_progress';
    
    // Simulate agent processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    task.status = 'completed';
    task.completedAt = Date.now();
    task.result = `Task completed successfully by ${AGENTS.find(a => a.type === task.agentType)?.name}`;
    
    return task;
  }
}

export const multiAgentSystem = new MultiAgentSystem();
