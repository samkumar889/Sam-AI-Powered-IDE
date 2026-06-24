import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir, filepath } = await request.json();
    logger.info('Adding file to git', { dir, filepath });
    await gitService.add({ dir, filepath });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Git add error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
