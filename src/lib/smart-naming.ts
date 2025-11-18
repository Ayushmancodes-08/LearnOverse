/**
 * Smart Document Naming with Gemini AI
 * 
 * Generates beautiful, descriptive names for documents
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiKeyManager } from './api-key-manager';

/**
 * Clean up filename to make it more readable
 */
export function beautifyFilename(filename: string): string {
  // Remove .pdf extension
  let name = filename.replace(/\.pdf$/i, '');
  
  // Replace underscores and hyphens with spaces
  name = name.replace(/[_-]/g, ' ');
  
  // Remove common prefixes
  name = name.replace(/^(pyq|PYQ|previous year|exam|test|paper)\s*/i, '');
  
  // Capitalize first letter of each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Remove extra spaces
  name = name.replace(/\s+/g, ' ').trim();
  
  return name;
}

/**
 * Generate a beautiful name using Gemini AI (optional, costs API calls)
 * 
 * This analyzes the PDF content and generates a descriptive name
 */
export async function generateSmartName(
  filename: string,
  pdfText?: string,
  subcategory?: string
): Promise<string> {
  try {
    const apiKey = apiKeyManager.getCurrentKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // If we have PDF text, analyze it
    if (pdfText && pdfText.length > 100) {
      const preview = pdfText.substring(0, 2000); // First 2000 chars
      
      const prompt = `Analyze this document and generate a short, descriptive name (max 50 characters).

Document filename: ${filename}
${subcategory ? `Subject: ${subcategory}` : ''}

Document preview:
${preview}

Generate a clear, concise name that describes what this document is about.
Examples:
- "Data Structures Final Exam 2023"
- "Algorithms Midterm with Solutions"
- "Operating Systems Practice Questions"

Respond with ONLY the name, nothing else.`;

      const result = await model.generateContent(prompt);
      const generatedName = result.response.text().trim();
      
      // Validate and clean
      if (generatedName && generatedName.length > 0 && generatedName.length < 100) {
        return generatedName;
      }
    }
    
    // Fallback to beautified filename
    return beautifyFilename(filename);
    
  } catch (error) {
    return beautifyFilename(filename);
  }
}

/**
 * Batch generate names for multiple documents
 */
export async function generateSmartNames(
  documents: Array<{ filename: string; text?: string; subcategory?: string }>
): Promise<Map<string, string>> {
  const names = new Map<string, string>();
  
  for (const doc of documents) {
    const name = await generateSmartName(doc.filename, doc.text, doc.subcategory);
    names.set(doc.filename, name);
  }
  
  return names;
}

/**
 * Extract key information from filename
 */
export function extractFileInfo(filename: string): {
  subject?: string;
  year?: string;
  type?: string;
  semester?: string;
} {
  const info: any = {};
  
  // Extract year (2020-2030)
  const yearMatch = filename.match(/20[2-3]\d/);
  if (yearMatch) {
    info.year = yearMatch[0];
  }
  
  // Extract semester
  const semMatch = filename.match(/sem(?:ester)?\s*(\d)/i);
  if (semMatch) {
    info.semester = semMatch[1];
  }
  
  // Extract type
  if (/pyq|previous year|past paper/i.test(filename)) {
    info.type = 'PYQ';
  } else if (/mid(?:term)?/i.test(filename)) {
    info.type = 'Midterm';
  } else if (/final/i.test(filename)) {
    info.type = 'Final';
  } else if (/quiz/i.test(filename)) {
    info.type = 'Quiz';
  }
  
  return info;
}

/**
 * Generate a smart name from filename only (no API call)
 */
export function generateQuickName(filename: string, subcategory?: string): string {
  const info = extractFileInfo(filename);
  const beautified = beautifyFilename(filename);
  
  // Build a nice name from extracted info
  const parts: string[] = [];
  
  if (subcategory) {
    parts.push(subcategory);
  }
  
  if (info.type) {
    parts.push(info.type);
  }
  
  if (info.year) {
    parts.push(info.year);
  }
  
  if (info.semester) {
    parts.push(`Sem ${info.semester}`);
  }
  
  // If we have enough info, use it
  if (parts.length >= 2) {
    return parts.join(' - ');
  }
  
  // Otherwise use beautified filename
  return beautified;
}
