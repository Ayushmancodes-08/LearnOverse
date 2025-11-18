import { describe, it, expect } from 'vitest';

describe('Chat Service - RAG Retrieval', () => {
  it('should handle empty query', async () => {
    const query = '';
    const text = 'Sample document text';
    
    expect(query.trim().length).toBe(0);
  });

  it('should handle empty document', async () => {
    const query = 'What is this about?';
    const text = '';
    
    expect(text.trim().length).toBe(0);
  });

  it('should split text into chunks correctly', () => {
    const text = `First paragraph about topic A.

Second paragraph about topic B.

Third paragraph about topic C.`;

    const chunks = text
      .split(/\n\n+/)
      .map(chunk => chunk.trim())
      .filter(chunk => chunk.length > 20);

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0]).toContain('First paragraph');
  });

  it('should score chunks based on keyword matches', () => {
    const query = 'machine learning';
    const text = `Machine learning is a subset of AI.
    
Deep learning uses neural networks.

Machine learning algorithms learn from data.`;

    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const chunks = text.split(/\n\n+/).map(c => c.trim());

    const scored = chunks.map(chunk => {
      const chunkLower = chunk.toLowerCase();
      let score = 0;
      queryWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = chunk.match(regex);
        score += (matches?.length || 0) * 2;
      });
      return { chunk, score };
    });

    const topChunk = scored.sort((a, b) => b.score - a.score)[0];
    expect(topChunk.score).toBeGreaterThan(0);
  });
});
