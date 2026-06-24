import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir, ref } = await request.json();
    logger.info('Checking out git branch', { dir, ref });
    const result = await gitService.checkoutBranch({ dir, ref });
    return NextResponse.json(result);
  } catch (error) {
    logger.error('Git checkout error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
