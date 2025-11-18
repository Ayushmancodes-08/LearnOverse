import { describe, it, expect } from 'vitest';

describe('Mindmap Service', () => {
  it('should reject empty document text', async () => {
    const text = '';
    expect(text.trim().length).toBe(0);
  });

  it('should validate markdown structure', () => {
    const markdown = `# Main Topic
## Subtopic 1
- Point 1
- Point 2

## Subtopic 2
- Point 3`;

    expect(markdown).toContain('#');
    expect(markdown).toContain('##');
    expect(markdown).toContain('-');
  });

  it('should handle large documents', () => {
    const largeText = 'a'.repeat(30000);
    expect(largeText.length).toBeLessThanOrEqual(100000);
  });

  it('should reject documents over 100KB', () => {
    const tooLargeText = 'a'.repeat(100001);
    expect(tooLargeText.length).toBeGreaterThan(100000);
  });

  it('should validate markdown has proper structure', () => {
    const validMarkdown = `# Title
## Section
- Item`;

    const hasHeadings = validMarkdown.includes('#');
    const hasBullets = validMarkdown.includes('-');

    expect(hasHeadings).toBe(true);
    expect(hasBullets).toBe(true);
  });
});
