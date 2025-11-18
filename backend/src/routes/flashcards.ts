import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { getSupabase } from '../config/supabase.js';
import { generateFlashcards } from '../services/flashcardService.js';

export const flashcardRoutes = Router();

// POST /api/flashcards/generate
flashcardRoutes.post(
  '/generate',
  asyncHandler(async (req: Request, res: Response) => {
    const { documentText, count = 10, documentId } = req.body;

    if (!documentText || !documentText.trim()) {
      throw new AppError(400, 'documentText is required');
    }

    if (documentText.length > 100000) {
      throw new AppError(400, 'Document text is too large (max 100,000 characters)');
    }

    const countNum = parseInt(String(count), 10);
    if (isNaN(countNum) || countNum < 5 || countNum > 20) {
      throw new AppError(400, 'count must be a number between 5 and 20');
    }

    // Check cache first
    let cached = false;
    let flashcards: any[] = [];

    if (documentId) {
      const supabase = getSupabase();
      try {
        const { data } = await supabase
          .from('generated_content')
          .select('content, expires_at')
          .eq('document_id', documentId)
          .eq('type', 'flashcards')
          .contains('metadata', { count: countNum })
          .single();

        if (data) {
          // Check if cache is still valid
          const expiresAt = new Date(data.expires_at);
          if (expiresAt > new Date()) {
            flashcards = JSON.parse(data.content);
            cached = true;
          }
        }
      } catch (error) {
        console.warn('Cache lookup failed:', error);
        // Continue with generation if cache lookup fails
      }
    }

    // Generate if not cached
    if (flashcards.length === 0) {
      flashcards = await generateFlashcards(documentText, countNum);

      // Store in cache
      if (documentId) {
        const supabase = getSupabase();
        try {
          await supabase.from('generated_content').insert({
            document_id: documentId,
            type: 'flashcards',
            content: JSON.stringify(flashcards),
            metadata: { count: countNum, generatedAt: new Date().toISOString() },
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          });
        } catch (error) {
          console.warn('Failed to cache flashcards:', error);
          // Don't fail the request if caching fails
        }
      }
    }

    res.json({
      status: 'success',
      flashcards,
      cached,
    });
  })
);
