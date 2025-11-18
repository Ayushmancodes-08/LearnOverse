import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { getSupabase } from '../config/supabase.js';
import { generateSummary } from '../services/summaryService.js';

export const summaryRoutes = Router();

const VALID_STYLES = ['Conceptual', 'Mathematical', 'Coding', 'Bullet Points', 'Paragraph-wise'];
const VALID_DEPTHS = ['Basic', 'Friendly', 'Intermediate', 'Advanced'];
const VALID_LENGTHS = ['Short', 'Medium', 'Long'];

// POST /api/summary/generate
summaryRoutes.post(
  '/generate',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      documentText,
      style = 'Conceptual',
      depth = 'Intermediate',
      length = 'Medium',
      documentId,
    } = req.body;

    if (!documentText || !documentText.trim()) {
      throw new AppError(400, 'documentText is required');
    }

    if (documentText.length > 100000) {
      throw new AppError(400, 'Document text is too large (max 100,000 characters)');
    }

    // Validate parameters
    if (!VALID_STYLES.includes(style)) {
      throw new AppError(400, `Invalid style. Must be one of: ${VALID_STYLES.join(', ')}`);
    }

    if (!VALID_DEPTHS.includes(depth)) {
      throw new AppError(400, `Invalid depth. Must be one of: ${VALID_DEPTHS.join(', ')}`);
    }

    if (!VALID_LENGTHS.includes(length)) {
      throw new AppError(400, `Invalid length. Must be one of: ${VALID_LENGTHS.join(', ')}`);
    }

    // Check cache first
    let cached = false;
    let summary = '';

    if (documentId) {
      const supabase = getSupabase();
      try {
        const { data } = await (supabase
          .from('generated_content') as any)
          .select('content, expires_at')
          .eq('document_id', documentId)
          .eq('type', 'summary')
          .contains('metadata', { style, depth, length })
          .single();

        if (data) {
          // Check if cache is still valid
          const cacheData = data as any;
          const expiresAt = new Date(cacheData.expires_at);
          if (expiresAt > new Date()) {
            summary = cacheData.content;
            cached = true;
          }
        }
      } catch (error) {
        console.warn('Cache lookup failed:', error);
        // Continue with generation if cache lookup fails
      }
    }

    // Generate if not cached
    if (!summary) {
      summary = await generateSummary(documentText, style, depth, length);

      // Store in cache
      if (documentId) {
        const supabase = getSupabase();
        try {
          await (supabase.from('generated_content') as any).insert({
            document_id: documentId,
            type: 'summary',
            content: summary,
            metadata: { style, depth, length, generatedAt: new Date().toISOString() },
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          });
        } catch (error) {
          console.warn('Failed to cache summary:', error);
          // Don't fail the request if caching fails
        }
      }
    }

    res.json({
      status: 'success',
      summary,
      cached,
    });
  })
);
