import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiKeyManager } from './api-key-manager';
import { rateLimiter } from './rate-limiter';

/**
 * Vector store for document embeddings (in-memory)
 */
interface EmbeddingVector {
  text: string;
  embedding: number[];
  index: number;
}

class VectorStore {
  private vectors: EmbeddingVector[] = [];

  async addDocuments(texts: string[]): Promise<void> {
    for (let i = 0; i < texts.length; i++) {
      // Rate limit to avoid quota issues
      await rateLimiter.waitIfNeeded();
      
      const embedding = await this.createEmbedding(texts[i]);
      this.vectors.push({
        text: texts[i],
        embedding,
        index: i,
      });
      
      // Show progress
      if ((i + 1) % 10 === 0 || i === texts.length - 1) {
        // Progress tracking
      }
    }
  }

  async createEmbedding(text: string): Promise<number[]> {
    try {
      const apiKey = apiKeyManager.getCurrentKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      
      const result = await model.embedContent(text);
      
      apiKeyManager.markCurrentKeySuccess();
      
      return result.embedding.values;
    } catch (error: any) {
      // Check if quota error
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('quota') || errorMessage.includes('exceeded')) {
        apiKeyManager.markCurrentKeyFailed(error);
        
        // Retry with next key
        const apiKey = apiKeyManager.getCurrentKey();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(text);
        return result.embedding.values;
      }
      
      throw error;
    }
  }

  async similaritySearch(query: string, k: number = 3): Promise<string[]> {
    if (this.vectors.length === 0) {
      return [];
    }

    // Create embedding for query
    const queryEmbedding = await this.createEmbedding(query);

    // Calculate cosine similarity with all vectors
    const similarities = this.vectors.map(vector => ({
      text: vector.text,
      similarity: this.cosineSimilarity(queryEmbedding, vector.embedding),
    }));

    // Sort by similarity and return top k
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k)
      .map(item => item.text);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  clear(): void {
    this.vectors = [];
  }

  getSize(): number {
    return this.vectors.length;
  }
}

// Singleton instance
export const vectorStore = new VectorStore();

/**
 * Split text into chunks for embedding
 */
export function splitTextIntoChunks(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.substring(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

/**
 * Initialize RAG system with document text
 */
export async function initializeRAG(text: string): Promise<void> {
  // Clear existing vectors
  vectorStore.clear();

  // Split text into chunks
  const chunks = splitTextIntoChunks(text);

  // Create embeddings (with rate limiting)
  await vectorStore.addDocuments(chunks);
}

/**
 * Query the RAG system
 */
export async function queryRAG(query: string, k: number = 3): Promise<string> {
  if (vectorStore.getSize() === 0) {
    throw new Error('RAG system not initialized. Please upload a document first.');
  }

  // Find similar chunks
  const relevantChunks = await vectorStore.similaritySearch(query, k);
  
  return relevantChunks.join('\n\n---\n\n');
}
