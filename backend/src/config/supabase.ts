import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient>;

export function initializeSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_KEY)');
  }

  supabase = createClient(url, serviceKey);
  console.log('✅ Supabase initialized');
  return supabase;
}

export function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase not initialized. Call initializeSupabase() first.');
  }
  return supabase;
}

// Database schema types
export interface Document {
  id: string;
  name: string;
  file_path: string;
  char_count: number;
  extracted_text: string;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  document_id: string;
  question: string;
  answer: string;
  created_at: string;
}

export interface GeneratedContent {
  id: string;
  document_id: string;
  type: 'mindmap' | 'flashcards' | 'summary';
  content: string;
  metadata: Record<string, any>;
  created_at: string;
  expires_at: string;
}

export interface ChatMessage {
  id: string;
  document_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
