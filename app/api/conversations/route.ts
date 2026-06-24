import { NextResponse } from 'next/server';
import { ConversationRepository } from '@/lib/repositories/index.js';
import { logger } from '@/lib/logger.js';

const conversationRepo = new ConversationRepository();

export async function GET() {
  try {
    logger.info('Fetching all conversations');
    const conversations = await conversationRepo.findAll();
    return NextResponse.json({ success: true, data: conversations });
  } catch (error) {
    logger.error('Failed to fetch conversations', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logger.info('Creating conversation', { title: data.title });
    const conversation = await conversationRepo.create(data);
    return NextResponse.json({ success: true, data: conversation });
  } catch (error) {
    logger.error('Failed to create conversation', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
