import { NextResponse } from 'next/server';
import { AgentMemoryRepository } from '@/lib/repositories/index.js';
import { logger } from '@/lib/logger.js';

const agentMemoryRepo = new AgentMemoryRepository();

export async function GET() {
  try {
    logger.info('Fetching all agent memories');
    const memories = await agentMemoryRepo.findAll();
    return NextResponse.json({ success: true, data: memories });
  } catch (error) {
    logger.error('Failed to fetch agent memories', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logger.info('Creating agent memory', { key: data.key });
    const memory = await agentMemoryRepo.create(data);
    return NextResponse.json({ success: true, data: memory });
  } catch (error) {
    logger.error('Failed to create agent memory', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
