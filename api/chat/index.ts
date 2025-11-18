import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeSupabase } from '../../backend/src/config/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    initializeSupabase();
    
    const { query, documentText, documentId } = req.body;

    if (!query || !documentText) {
      return res.status(400).json({ error: 'Missing query or documentText' });
    }

    // TODO: Implement chat logic with Google Gemini
    return res.status(200).json({
      status: 'success',
      answer: 'Chat response placeholder',
      sources: []
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Chat failed' });
  }
}
