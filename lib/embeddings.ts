import OpenAI from 'openai';

// Simple chunker - splits text into chunks of ~1000 characters
export function chunkText(text: string, chunkSize: number = 1500, overlap: number = 100): string[] {
  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize);
    
    // If not at the end, try to find a natural break (newline, period)
    if (i + chunkSize < text.length) {
      const lastNewline = chunk.lastIndexOf('\n');
      const lastPeriod = chunk.lastIndexOf('. ');
      const breakIndex = Math.max(lastNewline, lastPeriod);
      
      if (breakIndex > chunkSize * 0.5) {
        chunks.push(chunk.slice(0, breakIndex + 1));
        i += breakIndex + 1 - overlap; // Add overlap
        continue;
      }
    }

    chunks.push(chunk);
    i += chunkSize - overlap;
  }

  return chunks;
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const openai = new OpenAI({ apiKey });

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });

  return response.data.map(item => item.embedding);
}

export async function getEmbedding(text: string): Promise<number[]> {
  const embeddings = await getEmbeddings([text]);
  return embeddings[0];
}
