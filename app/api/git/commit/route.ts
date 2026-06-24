import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir, message, author } = await request.json();
    logger.info('Creating git commit', { dir, message });
    const result = await gitService.commit({ dir, message, author });
    return NextResponse.json(result);
  } catch (error) {
    logger.error('Git commit error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
