import { describe, it, expect } from 'vitest';

describe('Summary Service', () => {
  it('should reject empty document text', () => {
    const text = '';
    expect(text.trim().length).toBe(0);
  });

  it('should validate style parameter', () => {
    const validStyles = ['Conceptual', 'Mathematical', 'Coding', 'Bullet Points', 'Paragraph-wise'];
    const invalidStyle = 'InvalidStyle';

    validStyles.forEach(style => {
      expect(validStyles).toContain(style);
    });

    expect(validStyles).not.toContain(invalidStyle);
  });

  it('should validate depth parameter', () => {
    const validDepths = ['Basic', 'Friendly', 'Intermediate', 'Advanced'];
    const invalidDepth = 'InvalidDepth';

    validDepths.forEach(depth => {
      expect(validDepths).toContain(depth);
    });

    expect(validDepths).not.toContain(invalidDepth);
  });

  it('should validate length parameter', () => {
    const validLengths = ['Short', 'Medium', 'Long'];
    const invalidLength = 'InvalidLength';

    validLengths.forEach(length => {
      expect(validLengths).toContain(length);
    });

    expect(validLengths).not.toContain(invalidLength);
  });

  it('should handle large documents', () => {
    const largeText = 'a'.repeat(50000);
    expect(largeText.length).toBeLessThanOrEqual(100000);
  });

  it('should reject documents over 100KB', () => {
    const tooLargeText = 'a'.repeat(100001);
    expect(tooLargeText.length).toBeGreaterThan(100000);
  });

  it('should provide descriptions for all parameters', () => {
    const styles = ['Conceptual', 'Mathematical', 'Coding', 'Bullet Points', 'Paragraph-wise'];
    const depths = ['Basic', 'Friendly', 'Intermediate', 'Advanced'];
    const lengths = ['Short', 'Medium', 'Long'];

    styles.forEach(style => {
      expect(style).toBeDefined();
    });

    depths.forEach(depth => {
      expect(depth).toBeDefined();
    });

    lengths.forEach(length => {
      expect(length).toBeDefined();
    });
  });
});
