import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir } = await request.json();
    logger.info('Getting current git branch', { dir });
    const branch = await gitService.getCurrentBranch(dir);
    return NextResponse.json({ success: true, branch });
  } catch (error) {
    logger.error('Git get current branch error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
