import { NextRequest, NextResponse } from 'next/server';
import { AutonomousAgentEngine } from '@/lib/agent-engine';

export async function POST(request: NextRequest) {
  try {
    const { prompt, files } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Initialize OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not set' }, { status: 500 });
    }

    // Initialize autonomous agent
    const agent = new AutonomousAgentEngine(apiKey);
    
    // Execute task
    const taskResult = await agent.executeTask(prompt);

    return NextResponse.json({
      success: taskResult.state === 'completed',
      task: taskResult,
      logs: agent.getLogs()
    });
  } catch (error) {
    console.error('Agent execution error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Agent execution failed',
        suggestion: 'Please check your prompt and try again'
      },
      { status: 500 }
    );
  }
}