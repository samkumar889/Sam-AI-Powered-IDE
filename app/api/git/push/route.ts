import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir, remote, ref, token } = await request.json();
    logger.info('Pushing to git', { dir, remote, ref });
    const result = await gitService.push({ dir, remote, ref, token });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    logger.error('Git push error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
