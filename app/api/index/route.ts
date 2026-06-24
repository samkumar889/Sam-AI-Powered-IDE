import { NextRequest, NextResponse } from 'next/server';
import { vectorStore, VectorDocument } from '@/lib/vector-store';
import { getEmbeddings, chunkText } from '@/lib/embeddings';
import { generateId } from '@/lib/codebase-scanner';
import { useAppStore } from '@/store/useAppStore';

// Since we're in a server component, we can't directly use the store,
// but we can work with the file tree data that the app already has.
// For now, we'll use the initial file tree from the store as a base.

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json();

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ error: 'Invalid files format' }, { status: 400 });
    }

    console.log(`Starting to index ${files.length} files...`);

    // Clear existing index
    vectorStore.clear();

    const documents: VectorDocument[] = [];

    for (const file of files) {
      const { path, name, content } = file;

      if (!content) {
        continue;
      }

      // Chunk the file content
      const chunks = chunkText(content);

      // Generate embeddings for all chunks
      const embeddings = await getEmbeddings(chunks);

      // Create vector documents
      chunks.forEach((chunkText, index) => {
        documents.push({
          id: generateId(),
          content: chunkText,
          vector: embeddings[index],
          metadata: {
            path,
            name,
            type: 'chunk',
            chunkIndex: index,
            totalChunks: chunks.length,
          },
        });
      });
    }

    // Add all documents to the vector store
    vectorStore.addDocuments(documents);

    console.log(`Indexed ${documents.length} chunks from ${files.length} files`);

    return NextResponse.json({
      success: true,
      documentCount: documents.length,
      fileCount: files.length,
    });
  } catch (error) {
    console.error('Indexing error:', error);
    return NextResponse.json(
      { error: 'Failed to index codebase' },
      { status: 500 }
    );
  }
}
