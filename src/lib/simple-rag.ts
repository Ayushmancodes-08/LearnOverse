/**
 * Simple RAG implementation without embeddings
 * Uses keyword-based chunking similar to Python's approach
 * but without the embedding API calls that cause quota issues
 */

interface Chunk {
  text: string;
  index: number;
}

class SimpleRAG {
  private chunks: Chunk[] = [];
  private chunkSize = 1000;
  private chunkOverlap = 200;

  /**
   * Initialize with document text (like Python's setup_rag_system)
   */
  initialize(text: string): void {
    this.chunks = [];
    const textChunks = this.splitText(text);
    
    this.chunks = textChunks.map((text, index) => ({
      text,
      index,
    }));
  }

  /**
   * Split text into chunks (like Python's RecursiveCharacterTextSplitter)
   */
  private splitText(text: string): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + this.chunkSize, text.length);
      chunks.push(text.substring(start, end));
      start += this.chunkSize - this.chunkOverlap;
    }

    return chunks;
  }

  /**
   * Find relevant chunks using keyword matching
   * (Simple but effective, no API calls needed)
   */
  query(query: string, k: number = 5): string[] {
    if (this.chunks.length === 0) {
      return [];
    }

    // Extract keywords from query
    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3); // Filter short words

    // Score each chunk based on keyword matches
    const scoredChunks = this.chunks.map(chunk => {
      const chunkLower = chunk.text.toLowerCase();
      
      // Count keyword occurrences
      let score = 0;
      queryWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        const matches = chunkLower.match(regex);
        score += matches ? matches.length : 0;
      });

      // Bonus for exact phrase match
      if (chunkLower.includes(query.toLowerCase())) {
        score += 10;
      }

      return { ...chunk, score };
    });

    // Sort by score and return top k
    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(item => item.text);
  }

  /**
   * Get combined context from relevant chunks
   */
  getContext(query: string, k: number = 5): string {
    const relevantChunks = this.query(query, k);
    return relevantChunks.join('\n\n---\n\n');
  }

  clear(): void {
    this.chunks = [];
  }

  getSize(): number {
    return this.chunks.length;
  }
}

// Singleton instance
export const simpleRAG = new SimpleRAG();
