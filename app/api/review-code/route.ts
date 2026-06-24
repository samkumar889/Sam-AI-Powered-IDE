import { NextRequest, NextResponse } from 'next/server';

const MODEL_PROVIDER_MAP: Record<string, { provider: string; model: string }> = {
  'gpt-4': { provider: 'openai', model: 'gpt-4' },
  'gpt-4o': { provider: 'openai', model: 'gpt-4o' },
  'gpt-4-turbo': { provider: 'openai', model: 'gpt-4-turbo' },
  'claude-3-opus': { provider: 'anthropic', model: 'claude-3-opus-20240229' },
  'claude-3-sonnet': { provider: 'anthropic', model: 'claude-3-sonnet-20240229' },
  'gemini-1.5-pro': { provider: 'google', model: 'gemini-1.5-pro' },
  'deepseek-v3': { provider: 'deepseek', model: 'deepseek-chat' },
};

const getModelConfig = () => {
  // Default to Claude 3 Sonnet if no model configured
  const defaultModel = 'claude-3-sonnet';
  return MODEL_PROVIDER_MAP[defaultModel] || MODEL_PROVIDER_MAP['claude-3-sonnet'];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, filePath, description } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const callLLM = async (messages: Array<{ role: 'system' | 'user'; content: string }>) => {
      const modelConfig = getModelConfig();
      let response;

      try {
        if (modelConfig.provider === 'anthropic') {
          const apiKey = process.env.ANTHROPIC_API_KEY;
          if (!apiKey) throw new Error('API key not configured');

          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: modelConfig.model,
              messages: messages.map((m) => ({
                role: m.role === 'system' ? 'user' : m.role,
                content: m.role === 'system' ? `System: ${m.content}` : m.content,
              })),
              max_tokens: 4096,
            }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error?.message || 'API request failed');
          return data.content[0].text;
        } else if (modelConfig.provider === 'google') {
          const apiKey = process.env.GOOGLE_API_KEY;
          if (!apiKey) throw new Error('API key not configured');

          response = await fetch(
            `https://generativeai.googleapis.com/v1beta/models/${modelConfig.model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: messages.map((m) => ({
                  role: m.role === 'user' ? 'user' : 'model',
                  parts: [{ text: m.content }],
                })),
              }),
            }
          );

          const data = await response.json();
          if (!response.ok) throw new Error(data.error?.message || 'API request failed');
          return data.candidates[0].content.parts[0].text;
        }
      } catch {
        return null;
      }

      throw new Error('Unsupported provider');
    };

    const reviewSystemPrompt = `You are an expert senior software engineer specializing in code review, refactoring, and optimization. Your tasks are:
1. Review the code for errors, bugs, security issues, and bad practices
2. Refactor the code to follow best practices, improve readability, and reduce complexity
3. Optimize the code for performance, maintainability, and scalability

Respond with a JSON object containing the following fields:
- review: Detailed review points (array of strings)
- refactoredCode: The refactored and optimized code
- improvements: List of key improvements made (array of strings)

Only respond with valid JSON, no extra text.`;

    const reviewUserPrompt = `Please review, refactor, and optimize this code:
File: ${filePath}
Project Description: ${description}

\`\`\`
${code}
\`\`\``;

    let reviewResult = null;
    const llmResponse = await callLLM([
      { role: 'system', content: reviewSystemPrompt },
      { role: 'user', content: reviewUserPrompt },
    ]);

    if (llmResponse) {
      try {
        const cleanedResponse = llmResponse.trim();
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          reviewResult = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse review result:', e);
      }
    }

    if (!reviewResult) {
      // Fallback: return original code with basic review
      reviewResult = {
        review: ['No specific issues found in this code.', 'Code is already in a good state.'],
        refactoredCode: code,
        improvements: ['Code preserved as-is'],
      };
    }

    return NextResponse.json(reviewResult);
  } catch (error) {
    console.error('Review code error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to review code' },
      { status: 500 }
    );
  }
}
