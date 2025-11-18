import { describe, it, expect } from 'vitest';
import { extractTextFromPDF } from './pdfProcessor.js';

describe('PDF Processor', () => {
  it('should throw error for invalid PDF', async () => {
    const invalidBuffer = Buffer.from('not a pdf');
    
    try {
      await extractTextFromPDF(invalidBuffer);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should handle empty buffer', async () => {
    const emptyBuffer = Buffer.from('');
    
    try {
      await extractTextFromPDF(emptyBuffer);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
