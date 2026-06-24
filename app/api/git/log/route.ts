import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir } = await request.json();
    logger.info('Getting git log', { dir });
    const commits = await gitService.log(dir);
    return NextResponse.json({ success: true, commits });
  } catch (error) {
    logger.error('Git log error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
