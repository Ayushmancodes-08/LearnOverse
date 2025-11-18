import * as pdfjsLib from 'pdfjs-dist';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    console.log(`PDF has ${pdf.numPages} pages`);
    
    let fullText = '';
    let textExtractedCount = 0;
    const maxPages = Math.min(pdf.numPages, 50); // Limit to 50 pages for OCR

    // First, try standard text extraction
    for (let i = 1; i <= maxPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const items = textContent.items as any[];
        
        if (items.length === 0) {
          console.warn(`Page ${i} has no text items - may be image-based`);
          continue;
        }

        let currentLine = '';
        let lastY = items[0]?.y || 0;
        let pageText = '';

        for (const item of items) {
          const itemText = item.str || '';
          
          if (Math.abs(item.y - lastY) > 3 && currentLine.trim()) {
            pageText += currentLine.trim() + '\n';
            currentLine = '';
          }
          
          currentLine += itemText + ' ';
          lastY = item.y;
        }

        if (currentLine.trim()) {
          pageText += currentLine.trim() + '\n';
        }

        if (pageText.trim().length > 0) {
          fullText += pageText + '\n';
          textExtractedCount++;
          console.log(`Page ${i}: extracted ${pageText.length} characters`);
        }
      } catch (pageError) {
        console.warn(`Failed to extract page ${i}:`, pageError);
        continue;
      }
    }

    const cleanedText = fullText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    console.log(`Standard extraction: ${cleanedText.length} characters from ${textExtractedCount} pages`);

    // If we got very little text, try OCR with Gemini Vision
    if (cleanedText.length < 200) {
      console.log('Text extraction too short, attempting OCR with Gemini Vision...');
      const ocrText = await extractTextWithOCR(buffer, pdf, maxPages);
      if (ocrText.length > cleanedText.length) {
        console.log(`OCR extraction: ${ocrText.length} characters`);
        return ocrText;
      }
    }

    if (cleanedText.length === 0) {
      throw new Error('No text content found in PDF - PDF may be image-based. Please use OCR or provide a text-based PDF.');
    }

    // Enhance the extracted text
    const enhancedText = await enhanceExtractedText(cleanedText);
    return enhancedText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function extractTextWithOCR(buffer: Buffer, pdf: any, maxPages: number): Promise<string> {
  try {
    const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    let allText = '';

    // Process first 10 pages with OCR (to avoid too many API calls)
    const pagesToProcess = Math.min(maxPages, 10);

    for (let i = 1; i <= pagesToProcess; i++) {
      try {
        console.log(`Processing page ${i} with OCR...`);
        const page = await pdf.getPage(i);
        
        // Render page to image
        // Note: Canvas rendering requires native dependencies
        // For production, consider using a service like AWS Textract or Google Document AI
        console.log(`Skipping OCR for page ${i} - canvas not available`);
        continue;
      } catch (pageError) {
        console.warn(`Failed to OCR page ${i}:`, pageError);
        continue;
      }
    }

    return allText;
  } catch (error) {
    console.warn('OCR extraction failed:', error);
    return '';
  }
}

async function enhanceExtractedText(rawText: string): Promise<string> {
  try {
    if (rawText.length < 100) {
      console.log('Text too short for enhancement, returning as-is');
      return rawText;
    }

    const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a document processing expert. The following is raw extracted text from a PDF (possibly from OCR). 
Your task is to:
1. Clean up formatting issues and extra spaces
2. Preserve the logical structure and hierarchy
3. Fix any OCR errors or garbled text
4. Organize content into clear sections
5. Maintain ALL important information - do not remove or summarize content
6. Keep all educational material, questions, answers, and data

Return the cleaned and structured text, ready for analysis:

${rawText.slice(0, 80000)}`;

    const result = await model.generateContent(prompt);
    const enhancedText = result.response.text();

    console.log(`Enhanced text: ${enhancedText.length} characters`);
    return enhancedText || rawText;
  } catch (error) {
    console.warn('Text enhancement failed, using raw text:', error);
    return rawText;
  }
}
