import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Document {
  id: string;
  user_id?: string;
  name: string;
  type: 'main' | 'resource';
  file_path: string;
  char_count: number;
  created_at: string;
  updated_at: string;
}

export interface Mindmap {
  id: string;
  document_id: string;
  markdown_content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  document_id: string;
  messages: Array<{ role: string; content: string }>;
  created_at: string;
  updated_at: string;
}
