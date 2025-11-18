import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { getSupabase } from '../config/supabase.js';
import { generateChatResponse } from '../services/chatService.js';

export const chatRoutes = Router();

// POST /api/chat
chatRoutes.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { query, documentText, documentId, conversationHistory } = req.body;

    if (!query || !query.trim()) {
      throw new AppError(400, 'Query cannot be empty');
    }

    if (!documentText || !documentText.trim()) {
      throw new AppError(400, 'Document text is required');
    }

    // Validate query length
    if (query.length > 5000) {
      throw new AppError(400, 'Query is too long (max 5000 characters)');
    }

    // Generate response using RAG
    const answer = await generateChatResponse(query, documentText);

    // Store message in Supabase if documentId provided
    if (documentId) {
      const supabase = getSupabase();
      try {
        await (supabase.from('chat_messages') as any).insert([
          { document_id: documentId, role: 'user', content: query },
          { document_id: documentId, role: 'assistant', content: answer },
        ]);
      } catch (error) {
        console.warn('Failed to store chat message:', error);
        // Don't fail the request if storage fails
      }
    }

    res.json({
      status: 'success',
      answer,
      sources: [],
    });
  })
);

// GET /api/chat/history/:documentId
chatRoutes.get(
  '/history/:documentId',
  asyncHandler(async (req: Request, res: Response) => {
    const { documentId } = req.params;

    if (!documentId) {
      throw new AppError(400, 'documentId is required');
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      throw new AppError(500, `Failed to fetch chat history: ${error.message}`);
    }

    res.json({
      status: 'success',
      messages: data || [],
    });
  })
);
