import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up the worker - use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractTextFromPDF = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (onProgress) onProgress(10);

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    if (onProgress) onProgress(30);

    const numPages = pdf.numPages;
    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine all text items
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
      
      // Update progress
      if (onProgress) {
        const progress = 30 + Math.floor((pageNum / numPages) * 60);
        onProgress(progress);
      }
    }

    if (onProgress) onProgress(100);

    // Clean up the text
    fullText = fullText
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .trim();

    if (fullText.length < 50) {
      // Instead of throwing, return a helpful message
      return `[This PDF appears to be image-based or contains very little extractable text. File: ${file.name}]\n\nTo use this document, you may need to:\n1. Use a PDF with text layer (not scanned images)\n2. Or use OCR software to convert it first\n3. Or manually type/paste the content`;
    }

    return fullText;

  } catch (error) {
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to extract text from PDF. The file might be corrupted or image-based.'
    );
  }
};

export const extractTextFromTextFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const processFile = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractTextFromPDF(file, onProgress);
  } else if (fileType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    return extractTextFromTextFile(file);
  } else {
    throw new Error('Unsupported file type. Please upload PDF, TXT, or MD files.');
  }
};
