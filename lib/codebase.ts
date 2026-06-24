const API_BASE = 'http://localhost:3001/api';

export interface SearchResult {
  id: string;
  documentId: string;
  path: string;
  content: string;
  startLine: number;
  endLine: number;
  score: number;
}

export interface IndexStatus {
  success: boolean;
  filesIndexed?: number;
  message?: string;
  error?: string;
}

export const indexCodebase = async (): Promise<IndexStatus> => {
  try {
    const response = await fetch(`${API_BASE}/index`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (err) {
    return { success: false, error: 'Failed to connect to indexing server' };
  }
};

export const searchCodebase = async (query: string, limit = 5): Promise<{
  success: boolean;
  results: SearchResult[];
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit })
    });
    return await response.json();
  } catch (err) {
    return { success: false, results: [], error: 'Failed to search codebase' };
  }
};

export const getDocuments = async (): Promise<{
  success: boolean;
  documents: { id: string; path: string }[];
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE}/documents`);
    return await response.json();
  } catch (err) {
    return { success: false, documents: [], error: 'Failed to fetch documents' };
  }
};
