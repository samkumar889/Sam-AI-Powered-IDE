import { NextResponse } from 'next/server';
import { DeploymentRepository } from '@/lib/repositories/index';
import { logger } from '@/lib/logger';

const deploymentRepo = new DeploymentRepository();

export async function GET() {
  try {
    logger.info('Fetching all deployments');
    const deployments = await deploymentRepo.findAll();
    return NextResponse.json({ success: true, data: deployments });
  } catch (error) {
    logger.error('Failed to fetch deployments', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logger.info('Creating deployment', { name: data.name });
    const deployment = await deploymentRepo.create(data);
    return NextResponse.json({ success: true, data: deployment });
  } catch (error) {
    logger.error('Failed to create deployment', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
