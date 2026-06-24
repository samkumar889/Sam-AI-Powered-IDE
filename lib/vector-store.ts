export interface VectorDocument {
  id: string;
  content: string;
  vector: number[];
  metadata: {
    path: string;
    name: string;
    type: 'file' | 'chunk';
    chunkIndex?: number;
    totalChunks?: number;
  };
}

export class VectorStore {
  private documents: VectorDocument[] = [];

  addDocument(doc: VectorDocument) {
    this.documents.push(doc);
  }

  addDocuments(docs: VectorDocument[]) {
    this.documents.push(...docs);
  }

  clear() {
    this.documents = [];
  }

  // Cosine similarity
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (normA * normB);
  }

  search(queryVector: number[], topK: number = 5): (VectorDocument & { similarity: number })[] {
    return this.documents
      .map(doc => ({
        ...doc,
        similarity: this.cosineSimilarity(doc.vector, queryVector),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  getAllDocuments(): VectorDocument[] {
    return [...this.documents];
  }

  getDocumentCount(): number {
    return this.documents.length;
  }
}

// Singleton instance
export const vectorStore = new VectorStore();
