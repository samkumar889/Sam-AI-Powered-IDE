import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir, defaultBranch } = await request.json();
    logger.info('Initializing git repository', { dir, defaultBranch });
    const result = await gitService.init({ dir, defaultBranch });
    return NextResponse.json(result);
  } catch (error) {
    logger.error('Git init error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
