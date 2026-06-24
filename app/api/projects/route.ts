import { NextResponse } from 'next/server';
import { ProjectRepository } from '@/lib/repositories/index';
import { logger } from '@/lib/logger';

const projectRepo = new ProjectRepository();

export async function GET() {
  try {
    logger.info('Fetching all projects');
    const projects = await projectRepo.findAll();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    logger.error('Failed to fetch projects', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logger.info('Creating project', { name: data.name });
    const project = await projectRepo.create(data);
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    logger.error('Failed to create project', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
