import { GoogleGenerativeAI } from '@google/generative-ai';

const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Simple RAG: retrieve relevant chunks by keyword and semantic matching
function retrieveRelevantChunks(query: string, text: string, k: number = 5): string[] {
  // Split text into chunks (paragraphs or sentences)
  const chunks = text
    .split(/\n\n+/)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 20); // Minimum chunk size

  if (chunks.length === 0) {
    return [text.slice(0, 2000)]; // Fallback to first 2000 chars
  }

  // Normalize query
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  // Score chunks based on keyword matches and proximity
  const scored = chunks.map((chunk, index) => {
    const chunkLower = chunk.toLowerCase();
    
    // Count keyword matches
    let keywordScore = 0;
    queryWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = chunk.match(regex);
      keywordScore += (matches?.length || 0) * 2;
    });

    // Bonus for chunks that contain multiple query words
    const uniqueMatches = queryWords.filter(word => chunkLower.includes(word)).length;
    const uniqueScore = uniqueMatches * 3;

    // Bonus for earlier chunks (they often contain summaries)
    const positionScore = Math.max(0, 10 - index * 0.1);

    const totalScore = keywordScore + uniqueScore + positionScore;
    return { chunk, score: totalScore, index };
  });

  // Sort by score and return top k
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .sort((a, b) => a.index - b.index) // Maintain original order
    .map(item => item.chunk);
}

export async function generateChatResponse(query: string, documentText: string): Promise<string> {
  try {
    if (!query || query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }

    if (!documentText || documentText.trim().length === 0) {
      throw new Error('Document text is empty');
    }

    // Retrieve relevant chunks
    const relevantChunks = retrieveRelevantChunks(query, documentText, 5);
    const context = relevantChunks.join('\n\n---\n\n');

    // Generate response with Gemini
    const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are an expert study assistant. Your role is to help students understand their study materials.

Guidelines:
- Answer questions accurately and concisely based ONLY on the provided context
- If the context doesn't contain the answer, clearly state that
- Use simple, clear language suitable for students
- Provide examples from the context when helpful
- Be encouraging and supportive`;

    const userPrompt = `Based on the following context from the study material, please answer this question:

CONTEXT:
${context}

QUESTION: ${query}

Please provide a clear, concise answer.`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: systemPrompt,
    });

    const response = result.response;
    const answer = response.text();

    if (!answer || answer.trim().length === 0) {
      throw new Error('Empty response from AI model');
    }

    return answer;
  } catch (error) {
    console.error('Chat service error:', error);
    throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
