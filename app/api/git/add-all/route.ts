import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir } = await request.json();
    logger.info('Adding all files to git', { dir });
    await gitService.addAll(dir);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Git add all error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
