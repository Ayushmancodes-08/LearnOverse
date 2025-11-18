import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { getSupabase } from '../config/supabase.js';
import { generateMindmap } from '../services/mindmapService.js';

export const mindmapRoutes = Router();

// POST /api/mindmap/generate
mindmapRoutes.post(
  '/generate',
  asyncHandler(async (req: Request, res: Response) => {
    const { documentText, documentId } = req.body;

    if (!documentText || !documentText.trim()) {
      throw new AppError(400, 'documentText is required');
    }

    if (documentText.length > 100000) {
      throw new AppError(400, 'Document text is too large (max 100,000 characters)');
    }

    // Check cache first
    let cached = false;
    let markdown = '';

    if (documentId) {
      const supabase = getSupabase();
      try {
        const { data } = await (supabase
          .from('generated_content') as any)
          .select('content, expires_at')
          .eq('document_id', documentId)
          .eq('type', 'mindmap')
          .single();

        if (data) {
          // Check if cache is still valid
          const cacheData = data as any;
          const expiresAt = new Date(cacheData.expires_at);
          if (expiresAt > new Date()) {
            markdown = cacheData.content;
            cached = true;
          }
        }
      } catch (error) {
        console.warn('Cache lookup failed:', error);
        // Continue with generation if cache lookup fails
      }
    }

    // Generate if not cached
    if (!markdown) {
      markdown = await generateMindmap(documentText);

      // Store in cache
      if (documentId) {
        const supabase = getSupabase();
        try {
          await (supabase.from('generated_content') as any).insert({
            document_id: documentId,
            type: 'mindmap',
            content: markdown,
            metadata: { generatedAt: new Date().toISOString() },
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          });
        } catch (error) {
          console.warn('Failed to cache mindmap:', error);
          // Don't fail the request if caching fails
        }
      }
    }

    res.json({
      status: 'success',
      markdown,
      cached,
    });
  })
);
