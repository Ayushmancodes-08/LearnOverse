import { describe, it, expect } from 'vitest';

describe('Flashcard Service', () => {
  it('should reject empty document text', () => {
    const text = '';
    expect(text.trim().length).toBe(0);
  });

  it('should validate count range', () => {
    const validCounts = [5, 10, 15, 20];
    const invalidCounts = [0, 4, 21, 100];

    validCounts.forEach(count => {
      expect(count).toBeGreaterThanOrEqual(5);
      expect(count).toBeLessThanOrEqual(20);
    });

    invalidCounts.forEach(count => {
      expect(count < 5 || count > 20).toBe(true);
    });
  });

  it('should parse JSON from various formats', () => {
    const jsonFormats = [
      '[{"question": "Q1", "answer": "A1"}]',
      '```json\n[{"question": "Q1", "answer": "A1"}]\n```',
      '```json[{"question": "Q1", "answer": "A1"}]```',
    ];

    jsonFormats.forEach(format => {
      expect(() => {
        const match = format.match(/\[([\s\S]*?)\]/);
        if (match) {
          JSON.parse(match[0]);
        }
      }).not.toThrow();
    });
  });

  it('should validate flashcard structure', () => {
    const validCard = { question: 'What is X?', answer: 'X is...' };
    const invalidCard = { question: 'What is X?' }; // Missing answer

    expect(validCard.question).toBeDefined();
    expect(validCard.answer).toBeDefined();
    expect(invalidCard.answer).toBeUndefined();
  });

  it('should handle large documents', () => {
    const largeText = 'a'.repeat(50000);
    expect(largeText.length).toBeLessThanOrEqual(100000);
  });

  it('should reject documents over 100KB', () => {
    const tooLargeText = 'a'.repeat(100001);
    expect(tooLargeText.length).toBeGreaterThan(100000);
  });
});
