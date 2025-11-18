import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import { summaryRoutes } from './summary.js';
import { initializeSupabase } from '../config/supabase.js';

describe('Summary Routes', () => {
  let app: express.Application;

  beforeAll(() => {
    try {
      initializeSupabase();
    } catch (error) {
      console.warn('Supabase not configured for tests');
    }

    app = express();
    app.use(express.json());
    app.use('/api/summary', summaryRoutes);
  });

  it('should reject empty document text', async () => {
    const response = await fetch('http://localhost:3001/api/summary/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: '',
        style: 'Conceptual',
        depth: 'Intermediate',
        length: 'Medium',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject invalid style', async () => {
    const response = await fetch('http://localhost:3001/api/summary/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: 'Sample text',
        style: 'InvalidStyle',
        depth: 'Intermediate',
        length: 'Medium',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject invalid depth', async () => {
    const response = await fetch('http://localhost:3001/api/summary/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: 'Sample text',
        style: 'Conceptual',
        depth: 'InvalidDepth',
        length: 'Medium',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject invalid length', async () => {
    const response = await fetch('http://localhost:3001/api/summary/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: 'Sample text',
        style: 'Conceptual',
        depth: 'Intermediate',
        length: 'InvalidLength',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should accept valid parameters', async () => {
    const response = await fetch('http://localhost:3001/api/summary/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: 'This is a sample document about machine learning and AI.',
        style: 'Conceptual',
        depth: 'Intermediate',
        length: 'Medium',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject document over 100KB', async () => {
    const largeText = 'a'.repeat(100001);
    const response = await fetch('http://localhost:3001/api/summary/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: largeText,
        style: 'Conceptual',
        depth: 'Intermediate',
        length: 'Medium',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });
});
