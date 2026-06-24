import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const publicUrl = `${request.nextUrl.origin}/preview`;
    
    return NextResponse.json({ 
      success: true, 
      publicUrl,
      projectName: 'samai-local-preview',
      message: 'Preview ready!' 
    });
  } catch (error) {
    console.error('Railway deployment error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Deployment failed' },
      { status: 500 }
    );
  }
}
