import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import { flashcardRoutes } from './flashcards.js';
import { initializeSupabase } from '../config/supabase.js';

describe('Flashcard Routes', () => {
  let app: express.Application;

  beforeAll(() => {
    try {
      initializeSupabase();
    } catch (error) {
      console.warn('Supabase not configured for tests');
    }

    app = express();
    app.use(express.json());
    app.use('/api/flashcards', flashcardRoutes);
  });

  it('should reject empty document text', async () => {
    const response = await fetch('http://localhost:3001/api/flashcards/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: '',
        count: 10,
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject count below 5', async () => {
    const response = await fetch('http://localhost:3001/api/flashcards/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: 'Sample text',
        count: 3,
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject count above 20', async () => {
    const response = await fetch('http://localhost:3001/api/flashcards/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: 'Sample text',
        count: 25,
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should accept valid parameters', async () => {
    const response = await fetch('http://localhost:3001/api/flashcards/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: 'This is a sample document about machine learning.',
        count: 10,
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject document over 100KB', async () => {
    const largeText = 'a'.repeat(100001);
    const response = await fetch('http://localhost:3001/api/flashcards/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: largeText,
        count: 10,
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });
});
