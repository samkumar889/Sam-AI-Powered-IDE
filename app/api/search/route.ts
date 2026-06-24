import { NextRequest, NextResponse } from 'next/server';
import { vectorStore } from '@/lib/vector-store';
import { getEmbedding } from '@/lib/embeddings';

export async function POST(request: NextRequest) {
  try {
    const { query, topK = 5 } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log(`Searching for: ${query}`);

    // Generate embedding for the query
    const queryVector = await getEmbedding(query);

    // Search the vector store
    const results = vectorStore.search(queryVector, topK);

    console.log(`Found ${results.length} results`);

    return NextResponse.json({
      success: true,
      results: results.map(doc => ({
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search codebase' },
      { status: 500 }
    );
  }
}
