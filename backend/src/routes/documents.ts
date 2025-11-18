import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { getSupabase } from '../config/supabase.js';
import { extractTextFromPDF } from '../services/pdfProcessor.js';

export const documentRoutes = Router();

// POST /api/documents/upload
documentRoutes.post(
  '/upload',
  asyncHandler(async (req: Request, res: Response) => {
    const { file, fileName } = req.body;

    if (!file || !fileName) {
      throw new AppError(400, 'File and fileName are required');
    }

    // Validate file size (max 50MB)
    const buffer = Buffer.from(file, 'base64');
    if (buffer.length > 50 * 1024 * 1024) {
      throw new AppError(400, 'File size exceeds 50MB limit');
    }

    // Validate file name
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      throw new AppError(400, 'Only PDF files are supported');
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(buffer);

    console.log(`PDF extraction complete: ${fileName} - ${extractedText.length} characters`);

    if (!extractedText || extractedText.length < 10) {
      throw new AppError(400, 'Failed to extract text from PDF. Ensure it is a valid text-based PDF with readable content.');
    }

    // Store in Supabase
    const supabase = getSupabase();
    const { data, error } = await (supabase
      .from('documents') as any)
      .insert({
        name: fileName,
        file_path: `uploads/${Date.now()}-${fileName}`,
        char_count: extractedText.length,
        extracted_text: extractedText,
      })
      .select()
      .single();

    if (error) {
      throw new AppError(500, `Failed to store document: ${error.message}`);
    }

    const docData = data as any;
    console.log(`Document stored: ${docData.id} - ${docData.char_count} characters`);

    res.json({
      status: 'success',
      documentId: docData.id,
      fileName: docData.name,
      textLength: docData.char_count,
      extractedText: docData.extracted_text,
    });
  })
);

// GET /api/documents/:id
documentRoutes.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new AppError(404, 'Document not found');
    }

    res.json({
      status: 'success',
      document: data,
    });
  })
);

// GET /api/documents
documentRoutes.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('documents')
      .select('id, name, char_count, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new AppError(500, `Failed to fetch documents: ${error.message}`);
    }

    res.json({
      status: 'success',
      documents: data || [],
    });
  })
);
