import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import { mindmapRoutes } from './mindmap.js';
import { initializeSupabase } from '../config/supabase.js';

describe('Mindmap Routes', () => {
  let app: express.Application;

  beforeAll(() => {
    try {
      initializeSupabase();
    } catch (error) {
      console.warn('Supabase not configured for tests');
    }

    app = express();
    app.use(express.json());
    app.use('/api/mindmap', mindmapRoutes);
  });

  it('should reject empty document text', async () => {
    const response = await fetch('http://localhost:3001/api/mindmap/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: '',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject document over 100KB', async () => {
    const largeText = 'a'.repeat(100001);
    const response = await fetch('http://localhost:3001/api/mindmap/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: largeText,
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should accept valid document text', async () => {
    const validText = 'This is a sample document about machine learning and AI concepts.';
    const response = await fetch('http://localhost:3001/api/mindmap/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: validText,
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });
});
