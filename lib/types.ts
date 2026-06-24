export interface User {
  id: string;
  name: string;
  email: string;
}

export interface File {
  id: string;
  name: string;
  path: string;
  content: string;
  type: string;
  projectId: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  files: File[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  projectId: string;
  createdAt: Date;
}

export interface AgentTask {
  id: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  type: string;
  input: string;
  result?: string;
  projectId: string;
  createdAt: Date;
}
