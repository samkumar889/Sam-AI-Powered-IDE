import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { command, args, cwd } = body;

    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 });
    }

    // Create a ReadableStream for streaming output
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Determine the working directory
          const workingDir = cwd || process.cwd();
          
          // Spawn the child process
          const child = spawn(command, args || [], {
            cwd: workingDir,
            shell: true,
          });

          // Handle stdout
          child.stdout?.on('data', (data) => {
            const chunk = encoder.encode(`data: ${JSON.stringify({ type: 'stdout', content: data.toString() })}\n\n`);
            controller.enqueue(chunk);
          });

          // Handle stderr
          child.stderr?.on('data', (data) => {
            const chunk = encoder.encode(`data: ${JSON.stringify({ type: 'stderr', content: data.toString() })}\n\n`);
            controller.enqueue(chunk);
          });

          // Handle process exit
          child.on('close', (code) => {
            const chunk = encoder.encode(`data: ${JSON.stringify({ type: 'exit', code })}\n\n`);
            controller.enqueue(chunk);
            controller.close();
          });

          // Handle errors
          child.on('error', (error) => {
            const chunk = encoder.encode(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`);
            controller.enqueue(chunk);
            controller.close();
          });
        } catch (error) {
          console.error('Terminal error:', error);
          const chunk = encoder.encode(`data: ${JSON.stringify({ type: 'error', content: String(error) })}\n\n`);
          controller.enqueue(chunk);
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Terminal API error:', error);
    return NextResponse.json(
      { error: 'Failed to process terminal request' },
      { status: 500 }
    );
  }
}
