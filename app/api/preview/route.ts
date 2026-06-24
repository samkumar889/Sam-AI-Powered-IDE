import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { files } = await request.json();
    
    let htmlContent = '<!DOCTYPE html><html lang="en"><head><title>SAM AI Preview</title></head><body><h1>Preview Not Available</h1></body></html>';
    let cssContent = '';
    let jsContent = '';

    if (files) {
      for (const file of files) {
        if (file.name.toLowerCase().endsWith('.html')) {
          htmlContent = file.content;
        } else if (file.name.toLowerCase().endsWith('.css')) {
          cssContent += file.content + '\n';
        } else if (file.name.toLowerCase().endsWith('.js')) {
          jsContent += file.content + '\n';
        }
      }
    }

    const fullHTML = htmlContent
      .replace('</head>', `<style>${cssContent}</style></head>`)
      .replace('</body>', `<script>${jsContent}</script></body>`);

    return new NextResponse(fullHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
