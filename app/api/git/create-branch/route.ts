import { NextResponse } from 'next/server';
import { gitService } from '@/lib/gitService';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { dir, ref, checkout } = await request.json();
    logger.info('Creating git branch', { dir, ref });
    const result = await gitService.createBranch({ dir, ref, checkout });
    return NextResponse.json(result);
  } catch (error) {
    logger.error('Git create branch error', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
