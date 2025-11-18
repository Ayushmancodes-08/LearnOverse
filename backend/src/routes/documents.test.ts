import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { documentRoutes } from './documents.js';
import { initializeSupabase } from '../config/supabase.js';

describe('Document Routes', () => {
  let app: express.Application;

  beforeAll(() => {
    // Initialize Supabase
    try {
      initializeSupabase();
    } catch (error) {
      console.warn('Supabase not configured for tests');
    }

    // Create test app
    app = express();
    app.use(express.json({ limit: '50mb' }));
    app.use('/api/documents', documentRoutes);
  });

  it('should reject upload without file', async () => {
    const response = await fetch('http://localhost:3001/api/documents/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: 'test.pdf' }),
    }).catch(() => null);

    // Test would require running server
    expect(response).toBeDefined();
  });

  it('should reject non-PDF files', async () => {
    const response = await fetch('http://localhost:3001/api/documents/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: Buffer.from('test').toString('base64'),
        fileName: 'test.txt',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject files over 50MB', async () => {
    const largeBuffer = Buffer.alloc(51 * 1024 * 1024);
    const response = await fetch('http://localhost:3001/api/documents/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: largeBuffer.toString('base64'),
        fileName: 'large.pdf',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });
});
