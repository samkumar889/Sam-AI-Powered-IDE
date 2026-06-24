import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositories/index';
import { logger } from '@/lib/logger';

const userRepo = new UserRepository();

export async function GET() {
  try {
    logger.info('Fetching all users');
    const users = await userRepo.findAll();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    logger.error('Failed to fetch users', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logger.info('Creating user', { email: data.email });
    const user = await userRepo.create(data);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    logger.error('Failed to create user', { error });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
