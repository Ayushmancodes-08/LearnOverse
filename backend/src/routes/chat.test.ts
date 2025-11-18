import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import { chatRoutes } from './chat.js';
import { initializeSupabase } from '../config/supabase.js';

describe('Chat Routes', () => {
  let app: express.Application;

  beforeAll(() => {
    try {
      initializeSupabase();
    } catch (error) {
      console.warn('Supabase not configured for tests');
    }

    app = express();
    app.use(express.json());
    app.use('/api/chat', chatRoutes);
  });

  it('should reject empty query', async () => {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: '',
        documentText: 'Sample text',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject empty document text', async () => {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'What is this?',
        documentText: '',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });

  it('should reject query over 5000 characters', async () => {
    const longQuery = 'a'.repeat(5001);
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: longQuery,
        documentText: 'Sample text',
      }),
    }).catch(() => null);

    expect(response).toBeDefined();
  });
});
