import { NextRequest, NextResponse } from 'next/server';

// Model mapping
const MODEL_PROVIDER_MAP: Record<string, { provider: string; model: string }> = {
  'gpt-4': { provider: 'openai', model: 'gpt-4' },
  'gpt-4o': { provider: 'openai', model: 'gpt-4o' },
  'gpt-4-turbo': { provider: 'openai', model: 'gpt-4-turbo' },
  'claude-3-opus': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'claude-3-sonnet': { provider: 'anthropic', model: 'claude-3-sonnet-20240229' },
  'gemini-1.5-pro': { provider: 'google', model: 'gemini-1.5-pro' },
  'deepseek-v3': { provider: 'deepseek', model: 'deepseek-chat' },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const modelConfig = MODEL_PROVIDER_MAP[model as string];
    if (!modelConfig) {
      return NextResponse.json(
        { error: 'Unsupported model' },
        { status: 400 }
      );
    }

    // Create a ReadableStream for streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let response;

          if (modelConfig.provider === 'openai' || modelConfig.provider === 'deepseek') {
            // OpenAI / DeepSeek (uses OpenAI-compatible API)
            const apiKey = modelConfig.provider === 'deepseek' 
              ? process.env.DEEPSEEK_API_KEY 
              : process.env.OPENAI_API_KEY;
            const baseUrl = modelConfig.provider === 'deepseek'
              ? 'https://api.deepseek.com/v1'
              : 'https://api.openai.com/v1';

            if (!apiKey) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `${modelConfig.provider.toUpperCase()} API key not configured` })}\n\n`));
              controller.close();
              return;
            }

            response = await fetch(`${baseUrl}/chat/completions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: modelConfig.model,
                messages,
                stream: true,
              }),
            });
          } else if (modelConfig.provider === 'anthropic') {
            // Anthropic Claude
            const apiKey = process.env.ANTHROPIC_API_KEY;
            if (!apiKey) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'ANTHROPIC API key not configured' })}\n\n`));
              controller.close();
              return;
            }

            response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
              },
              body: JSON.stringify({
                model: modelConfig.model,
                messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
                stream: true,
                max_tokens: 4096,
              }),
            });
          } else if (modelConfig.provider === 'google') {
            // Google Gemini
            const apiKey = process.env.GOOGLE_API_KEY;
            if (!apiKey) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'GOOGLE API key not configured' })}\n\n`));
              controller.close();
              return;
            }

            response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${modelConfig.model}:streamGenerateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  contents: messages.map((m: any) => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }],
                  })),
                }),
              }
            );
          } else {
            throw new Error('Unsupported provider');
          }

          if (!response.ok) {
            const errorText = await response.text();
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `API request failed: ${response.status} ${errorText}` })}\n\n`));
            controller.close();
            return;
          }

          const reader = response.body?.getReader();
          if (!reader) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'No response body' })}\n\n`));
            controller.close();
            return;
          }

          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine) continue;

              if (modelConfig.provider === 'anthropic') {
                if (trimmedLine.startsWith('data:')) {
                  const data = trimmedLine.slice(5).trim();
                  if (data === '[DONE]') continue;
                  try {
                    const parsed = JSON.parse(data);
                    if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: parsed.delta.text })}\n\n`));
                    }
                  } catch (e) {
                    // Ignore parse errors
                  }
                }
              } else if (modelConfig.provider === 'google') {
                try {
                  // Gemini streams with JSON arrays
                  const cleanedLine = trimmedLine.replace(/,$/, '');
                  if (cleanedLine.startsWith('[')) {
                    const parsed = JSON.parse(cleanedLine.replace(/^\[|\]$/g, ''));
                    if (Array.isArray(parsed.candidates)) {
                      for (const candidate of parsed.candidates) {
                        if (candidate.content?.parts) {
                          for (const part of candidate.content.parts) {
                            if (part.text) {
                              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: part.text })}\n\n`));
                            }
                          }
                        }
                      }
                    }
                  }
                } catch (e) {
                  // Ignore
                }
              } else {
                // OpenAI / DeepSeek format
                if (trimmedLine.startsWith('data:')) {
                  const data = trimmedLine.slice(5).trim();
                  if (data === '[DONE]') continue;
                  try {
                    const parsed = JSON.parse(data);
                    const delta = parsed.choices?.[0]?.delta?.content;
                    if (delta) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
                    }
                  } catch (e) {
                    // Ignore parse errors
                  }
                }
              }
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: String(error) })}\n\n`));
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
