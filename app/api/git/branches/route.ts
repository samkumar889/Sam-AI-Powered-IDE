import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir } = await request.json();
    logger.info('Listing git branches', { dir });
    const branches = await gitService.listBranches(dir);
    return NextResponse.json({ success: true, branches });
  } catch (error) {
    logger.error('Git branches error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
