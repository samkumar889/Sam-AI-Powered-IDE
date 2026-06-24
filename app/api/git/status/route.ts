import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir } = await request.json();
    logger.info('Checking git status', { dir });
    const status = await gitService.status(dir);
    return NextResponse.json({ success: true, status });
  } catch (error) {
    logger.error('Git status error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
