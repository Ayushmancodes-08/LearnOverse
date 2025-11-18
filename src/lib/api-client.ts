// API Base URL Configuration
// - Local dev: http://localhost:3001/api
// - Production: /api (same domain)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface UploadResponse {
  status: string;
  documentId: string;
  fileName: string;
  textLength: number;
  extractedText: string;
}

export interface ChatResponse {
  status: string;
  answer: string;
  sources: string[];
}

export interface MindmapResponse {
  status: string;
  markdown: string;
  cached: boolean;
}

export interface FlashcardResponse {
  status: string;
  flashcards: Array<{ id: string; question: string; answer: string }>;
  cached: boolean;
}

export interface SummaryResponse {
  status: string;
  summary: string;
  cached: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatHistoryResponse {
  status: string;
  messages: ChatMessage[];
}

export class APIClient {
  static async uploadDocument(file: File): Promise<UploadResponse> {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const response = await fetch(`${API_BASE_URL}/documents/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: base64,
              fileName: file.name,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
          }

          resolve(await response.json());
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  static async chat(query: string, documentText: string, documentId?: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        documentText,
        documentId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Chat failed');
    }

    return response.json();
  }

  static async getChatHistory(documentId: string): Promise<ChatHistoryResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/history/${documentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch chat history');
    }

    return response.json();
  }

  static async generateMindmap(documentText: string, documentId?: string): Promise<MindmapResponse> {
    if (!documentText || documentText.trim().length === 0) {
      throw new Error('Document text is required');
    }

    const response = await fetch(`${API_BASE_URL}/mindmap/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText,
        documentId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Mindmap generation failed');
    }

    const data = await response.json();
    
    if (!data.markdown || data.markdown.trim().length === 0) {
      throw new Error('Generated mindmap is empty');
    }

    return data;
  }

  static async generateFlashcards(
    documentText: string,
    count: number = 10,
    documentId?: string
  ): Promise<FlashcardResponse> {
    if (!documentText || documentText.trim().length === 0) {
      throw new Error('Document text is required');
    }

    if (count < 5 || count > 20) {
      throw new Error('Count must be between 5 and 20');
    }

    const response = await fetch(`${API_BASE_URL}/flashcards/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText,
        count,
        documentId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Flashcard generation failed');
    }

    const data = await response.json();

    if (!data.flashcards || data.flashcards.length === 0) {
      throw new Error('No flashcards were generated');
    }

    return data;
  }

  static async generateSummary(
    documentText: string,
    style: string = 'Conceptual',
    depth: string = 'Intermediate',
    length: string = 'Medium',
    documentId?: string
  ): Promise<SummaryResponse> {
    if (!documentText || documentText.trim().length === 0) {
      throw new Error('Document text is required');
    }

    const validStyles = ['Conceptual', 'Mathematical', 'Coding', 'Bullet Points', 'Paragraph-wise'];
    const validDepths = ['Basic', 'Friendly', 'Intermediate', 'Advanced'];
    const validLengths = ['Short', 'Medium', 'Long'];

    if (!validStyles.includes(style)) {
      throw new Error(`Invalid style. Must be one of: ${validStyles.join(', ')}`);
    }

    if (!validDepths.includes(depth)) {
      throw new Error(`Invalid depth. Must be one of: ${validDepths.join(', ')}`);
    }

    if (!validLengths.includes(length)) {
      throw new Error(`Invalid length. Must be one of: ${validLengths.join(', ')}`);
    }

    const response = await fetch(`${API_BASE_URL}/summary/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText,
        style,
        depth,
        length,
        documentId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Summary generation failed');
    }

    const data = await response.json();

    if (!data.summary || data.summary.trim().length === 0) {
      throw new Error('Generated summary is empty');
    }

    return data;
  }
}
