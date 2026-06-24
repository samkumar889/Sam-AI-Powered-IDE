import OpenAI from 'openai';

// Constants
const MAX_TOOL_CALLS = 10;
const MAX_RETRIES_PER_ERROR = 5;
const MAX_SAME_CALLS = 3;

// Types
export type AgentState = 'planning' | 'executing' | 'waiting' | 'completed' | 'failed';

export interface AgentLog {
  timestamp: number;
  type: 'tool-call' | 'error' | 'info' | 'success';
  message: string;
  details?: any;
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, any>;
  timestamp: number;
  result?: any;
  error?: string;
}

export interface AgentMemory {
  previousToolCalls: ToolCall[];
  toolResults: Map<string, any>;
  userPreferences: Record<string, any>;
}

export interface AgentTask {
  id: string;
  prompt: string;
  state: AgentState;
  logs: AgentLog[];
  toolCalls: ToolCall[];
  currentStep: number;
  error?: string;
  suggestion?: string;
}

// Generate unique ID
const generateId = (): string => Math.random().toString(36).substring(2, 15);

// Hash tool call for duplicate detection
const hashToolCall = (name: string, params: Record<string, any>): string => {
  return `${name}:${JSON.stringify(params)}`;
};

export class AutonomousAgentEngine {
  private openai: OpenAI;
  private task: AgentTask;
  private memory: AgentMemory;
  private abortController: AbortController;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    this.abortController = new AbortController();
    this.memory = {
      previousToolCalls: [],
      toolResults: new Map(),
      userPreferences: {},
    };
    this.task = {
      id: generateId(),
      prompt: '',
      state: 'planning',
      logs: [],
      toolCalls: [],
      currentStep: 0,
    };
  }

  // Add log entry
  private log(type: AgentLog['type'], message: string, details?: any) {
    const log: AgentLog = {
      timestamp: Date.now(),
      type,
      message,
      details,
    };
    this.task.logs.push(log);
    console.log(`[Agent] [${type.toUpperCase()}] ${message}`, details);
  }

  // Check for loops (same tool with same params multiple times)
  private detectLoop(toolName: string, params: Record<string, any>): boolean {
    const callHash = hashToolCall(toolName, params);
    const sameCalls = this.memory.previousToolCalls.filter(
      (call) => hashToolCall(call.name, call.parameters) === callHash
    );
    return sameCalls.length >= MAX_SAME_CALLS;
  }

  // Check if we have cached result for this tool call
  private getCachedResult(toolName: string, params: Record<string, any>): any | null {
    const callHash = hashToolCall(toolName, params);
    return this.memory.toolResults.get(callHash) || null;
  }

  // Cache tool result
  private cacheResult(toolName: string, params: Record<string, any>, result: any) {
    const callHash = hashToolCall(toolName, params);
    this.memory.toolResults.set(callHash, result);
  }

  // Execute a single tool call
  private async executeToolCall(
    toolName: string,
    params: Record<string, any>
  ): Promise<any> {
    this.log('info', `Executing tool: ${toolName}`, params);

    // Check for loops first
    if (this.detectLoop(toolName, params)) {
      const error = `Loop detected: ${toolName} called ${MAX_SAME_CALLS} times with same parameters`;
      this.log('error', error);
      throw new Error(error);
    }

    // Check cached results
    const cached = this.getCachedResult(toolName, params);
    if (cached) {
      this.log('info', `Using cached result for ${toolName}`);
      return cached;
    }

    // Record the tool call
    const toolCall: ToolCall = {
      id: generateId(),
      name: toolName,
      parameters: params,
      timestamp: Date.now(),
    };
    this.task.toolCalls.push(toolCall);
    this.memory.previousToolCalls.push(toolCall);

    // Execute tool (stub for now - will integrate with actual tools)
    let result;
    let retries = 0;

    while (retries < MAX_RETRIES_PER_ERROR) {
      try {
        result = await this.executeTool(toolName, params);
        toolCall.result = result;
        this.cacheResult(toolName, params, result);
        this.log('success', `Tool ${toolName} executed successfully`, result);
        return result;
      } catch (error) {
        retries++;
        toolCall.error = error instanceof Error ? error.message : String(error);
        this.log('error', `Tool ${toolName} failed (attempt ${retries}/${MAX_RETRIES_PER_ERROR})`, error);
        
        if (retries >= MAX_RETRIES_PER_ERROR) {
          throw error;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }

    throw new Error(`Max retries (${MAX_RETRIES_PER_ERROR}) exceeded for tool ${toolName}`);
  }

  // Actual tool execution (stub - integrate with real tools)
  private async executeTool(toolName: string, params: Record<string, any>): Promise<any> {
    // This is a stub - in real implementation, you would call actual tools
    // For now, let's simulate some tools
    switch (toolName) {
      case 'READ_FILE':
        return { content: `Sample content for ${params.path}` };
      case 'WRITE_FILE':
        return { success: true, path: params.path };
      case 'EDIT_FILE':
        return { success: true, path: params.path };
      case 'DELETE_FILE':
        return { success: true, path: params.path };
      case 'SEARCH_CODE':
        return { results: ['file1.ts', 'file2.ts'] };
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  // Main execution loop
  public async executeTask(prompt: string): Promise<AgentTask> {
    this.task = {
      id: generateId(),
      prompt,
      state: 'planning',
      logs: [],
      toolCalls: [],
      currentStep: 0,
    };

    this.log('info', 'Starting task execution', { prompt });

    try {
      let toolCallCount = 0;

      while (toolCallCount < MAX_TOOL_CALLS) {
        if (this.abortController.signal.aborted) {
          this.task.state = 'failed';
          this.task.error = 'Task aborted by user';
          this.log('error', this.task.error);
          break;
        }

        // Update state
        this.task.state = toolCallCount === 0 ? 'planning' : 'executing';
        this.task.currentStep = toolCallCount;

        // Get next action from LLM
        this.log('info', `Step ${toolCallCount + 1}/${MAX_TOOL_CALLS}: Querying LLM for next action`);
        
        const nextAction = await this.getNextActionFromLLM();

        if (!nextAction) {
          // Task complete
          this.task.state = 'completed';
          this.log('success', 'Task completed successfully');
          break;
        }

        // Execute the tool call
        await this.executeToolCall(nextAction.tool, nextAction.params);
        toolCallCount++;
      }

      if (toolCallCount >= MAX_TOOL_CALLS) {
        this.task.state = 'failed';
        this.task.error = `Maximum tool calls (${MAX_TOOL_CALLS}) exceeded`;
        this.task.suggestion = 'Consider breaking the task into smaller parts';
        this.log('error', this.task.error);
      }

    } catch (error) {
      this.task.state = 'failed';
      this.task.error = error instanceof Error ? error.message : String(error);
      this.task.suggestion = this.getSuggestionForError(error);
      this.log('error', 'Task failed', { error: this.task.error });
    }

    return this.task;
  }

  // Get next action from LLM
  private async getNextActionFromLLM(): Promise<{ tool: string; params: Record<string, any> } | null> {
    // Build context for LLM
    const context = this.buildLLMContext();
    
    const systemPrompt = `You are an autonomous coding agent. Your task is to complete the user's request by using available tools.

Available tools:
- READ_FILE: Read a file - params: { path: string }
- WRITE_FILE: Write a file - params: { path: string; content: string }
- EDIT_FILE: Edit a file - params: { path: string; oldContent: string; newContent: string }
- DELETE_FILE: Delete a file - params: { path: string }
- SEARCH_CODE: Search the codebase - params: { query: string }

Rules:
1. Think before you act - analyze the task and current state
2. Use tools appropriately to complete the task
3. If you detect that you're repeating the same action, stop and reconsider
4. When the task is complete, respond with "TASK_COMPLETE"

Respond in JSON format with either:
- {"tool": "TOOL_NAME", "params": {...}} for tool calls
- {"taskComplete": true} when done

Current state:
${JSON.stringify(context, null, 2)}
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: this.task.prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    
    if (response.taskComplete) {
      return null;
    }
    
    return {
      tool: response.tool,
      params: response.params,
    };
  }

  // Build context for LLM
  private buildLLMContext() {
    return {
      task: this.task.prompt,
      previousToolCalls: this.memory.previousToolCalls,
      currentStep: this.task.currentStep,
      totalSteps: MAX_TOOL_CALLS,
    };
  }

  // Get suggestion for error
  private getSuggestionForError(error: any): string {
    const message = error instanceof Error ? error.message : String(error);
    
    if (message.includes('Loop detected')) {
      return 'The agent got stuck in a loop. Try rephrasing your request or breaking it into smaller steps.';
    }
    
    if (message.includes('Maximum tool calls')) {
      return 'The task is too complex. Try breaking it into smaller, more focused requests.';
    }
    
    return 'Review the error details and try again with a different approach.';
  }

  // Abort the current task
  public abort(): void {
    this.abortController.abort();
    this.log('info', 'Task abort requested');
  }

  // Get current task state
  public getTask(): AgentTask {
    return this.task;
  }

  // Get logs
  public getLogs(): AgentLog[] {
    return this.task.logs;
  }
}

export default AutonomousAgentEngine;
