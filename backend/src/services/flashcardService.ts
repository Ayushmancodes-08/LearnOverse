import { GoogleGenerativeAI } from '@google/generative-ai';

const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

function parseFlashcardsFromResponse(responseText: string): Flashcard[] {
  // Try multiple JSON extraction patterns
  const patterns = [
    /```json\n([\s\S]*?)\n```/,
    /```json([\s\S]*?)```/,
    /\[([\s\S]*?)\]/,
  ];

  let jsonStr: string | null = null;

  for (const pattern of patterns) {
    const match = responseText.match(pattern);
    if (match) {
      jsonStr = match[1] || match[0];
      break;
    }
  }

  if (!jsonStr) {
    throw new Error('Could not extract JSON from response');
  }

  // Clean up the JSON string
  jsonStr = jsonStr.trim();
  if (!jsonStr.startsWith('[')) {
    jsonStr = '[' + jsonStr;
  }
  if (!jsonStr.endsWith(']')) {
    jsonStr = jsonStr + ']';
  }

  const parsed = JSON.parse(jsonStr);

  if (!Array.isArray(parsed)) {
    throw new Error('Parsed JSON is not an array');
  }

  return parsed.map((card: any, index: number) => {
    if (!card.question || !card.answer) {
      throw new Error(`Card ${index} missing question or answer`);
    }

    return {
      id: `card-${index}`,
      question: String(card.question).trim(),
      answer: String(card.answer).trim(),
    };
  });
}

export async function generateFlashcards(documentText: string, count: number): Promise<Flashcard[]> {
  try {
    if (!documentText || documentText.trim().length === 0) {
      throw new Error('Document text is empty');
    }

    if (count < 5 || count > 20) {
      throw new Error('Count must be between 5 and 20');
    }

    const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are an expert at creating effective flashcards for active recall learning.
Your flashcards should:
- Have clear, specific questions that test one concept
- Provide concise, accurate answers (1-3 sentences)
- Focus on key definitions, concepts, and relationships
- Use simple language
- Be suitable for spaced repetition learning
- Avoid yes/no questions
- Include practical examples when helpful`;

    const contentToUse = documentText.slice(0, 40000); // Increased from 25000
    
    const userPrompt = `Generate exactly ${count} high-quality flashcard question-answer pairs from this educational content.

REQUIREMENTS:
1. Each question should test ONE specific concept
2. Answers should be concise but complete (1-3 sentences)
3. Include a mix of: definitions, concepts, relationships, and applications
4. Questions should be clear and unambiguous
5. Answers should be accurate and helpful for learning

Respond ONLY with a valid JSON array, no other text:
[
  {"question": "What is X?", "answer": "X is..."},
  {"question": "How does Y work?", "answer": "Y works by..."}
]

Content:
${contentToUse}`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: systemPrompt,
    });

    const responseText = result.response.text();

    if (!responseText || responseText.trim().length === 0) {
      throw new Error('Empty response from AI model');
    }

    const flashcards = parseFlashcardsFromResponse(responseText);

    if (flashcards.length === 0) {
      throw new Error('No flashcards were generated');
    }

    if (flashcards.length < count * 0.8) {
      console.warn(`Generated ${flashcards.length} flashcards instead of ${count}`);
    }

    return flashcards;
  } catch (error) {
    console.error('Flashcard generation error:', error);
    throw new Error(`Failed to generate flashcards: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
