import { GoogleGenerativeAI } from '@google/generative-ai';

const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const STYLE_DESCRIPTIONS: Record<string, string> = {
  Conceptual: 'Focus on key concepts, definitions, and relationships between ideas',
  Mathematical: 'Include formulas, equations, and mathematical relationships',
  Coding: 'Include code examples, algorithms, and technical implementations',
  'Bullet Points': 'Use bullet points and numbered lists for clarity',
  'Paragraph-wise': 'Use flowing paragraphs with clear topic sentences',
};

const DEPTH_DESCRIPTIONS: Record<string, string> = {
  Basic: 'Cover only the most essential concepts and main ideas',
  Friendly: 'Use simple, accessible language suitable for beginners',
  Intermediate: 'Balance between simplicity and technical detail',
  Advanced: 'Include nuanced details, edge cases, and advanced concepts',
};

const LENGTH_DESCRIPTIONS: Record<string, string> = {
  Short: '2-3 paragraphs or 200-300 words',
  Medium: '4-6 paragraphs or 500-800 words',
  Long: '8-12 paragraphs or 1000-1500 words',
};

const FLASHCARD_OPTIMIZATION = `
FLASHCARD OPTIMIZATION GUIDELINES:
- Extract key facts that can become flashcard questions
- Use clear, concise language (ideal for Q&A format)
- Include definitions that are standalone and complete
- Highlight important terms in bold for easy identification
- Structure content with clear cause-effect relationships
- Include examples that illustrate concepts
- Use numbered lists for sequential concepts
- Separate distinct ideas with clear breaks
- Include formulas/equations on separate lines
- Mark important dates, numbers, and statistics
- Create natural question-answer pairs within the summary`;

export async function generateSummary(
  documentText: string,
  style: string = 'Conceptual',
  depth: string = 'Intermediate',
  length: string = 'Medium'
): Promise<string> {
  try {
    if (!documentText || documentText.trim().length === 0) {
      throw new Error('Document text is empty. Please ensure the PDF was uploaded successfully.');
    }

    // Validate parameters
    if (!STYLE_DESCRIPTIONS[style]) {
      throw new Error(`Invalid style: ${style}`);
    }
    if (!DEPTH_DESCRIPTIONS[depth]) {
      throw new Error(`Invalid depth: ${depth}`);
    }
    if (!LENGTH_DESCRIPTIONS[length]) {
      throw new Error(`Invalid length: ${length}`);
    }

    const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Ensure we have enough content
    const contentToSummarize = documentText.slice(0, 60000); // Increased from 50000
    
    if (contentToSummarize.trim().length < 50) {
      throw new Error(`Document content is too short (${contentToSummarize.trim().length} chars). Please upload a document with more content.`);
    }
    
    console.log(`Generating summary for ${contentToSummarize.length} characters of content`);
    console.log(`First 200 chars: ${contentToSummarize.slice(0, 200)}`);
    console.log(`Last 200 chars: ${contentToSummarize.slice(-200)}`);
    

    const systemPrompt = `You are an expert at creating clear, well-structured summaries of educational content optimized for learning and flashcard generation.
Your summaries should:
- Capture the most important information and key takeaways
- Be well-organized with clear sections and hierarchy
- Use appropriate language for the target audience
- Highlight key concepts, definitions, and relationships
- Be accurate and faithful to the source material
- Include practical examples when relevant
- Use formatting (bold, lists) to improve readability
- Be structured to naturally convert into flashcard Q&A pairs
- Extract and emphasize key facts, definitions, and relationships
- Use clear, concise language suitable for memorization

${FLASHCARD_OPTIMIZATION}`;

    const userPrompt = `Create a comprehensive summary of the following educational content.

SPECIFICATIONS:
- Style: ${style} (${STYLE_DESCRIPTIONS[style]})
- Depth: ${depth} (${DEPTH_DESCRIPTIONS[depth]})
- Length: ${LENGTH_DESCRIPTIONS[length]}

INSTRUCTIONS:
1. Identify and summarize the main topics
2. Explain key concepts clearly and concisely
3. Show relationships between ideas
4. Use clear formatting with headings and lists
5. Include important definitions (bold key terms)
6. Maintain accuracy to the source material
7. Structure content to be easily convertible to flashcards
8. Highlight important facts, dates, numbers, and statistics
9. Use numbered lists for sequential or hierarchical concepts
10. Create natural question-answer pairs within the summary

FORMATTING GUIDELINES:
- Use **bold** for key terms and definitions
- Use numbered lists (1., 2., 3.) for sequential concepts
- Use bullet points for related items
- Separate distinct topics with clear headings
- Include formulas/equations on separate lines
- Mark important statistics with emphasis

IMPORTANT: You MUST provide a summary. Do not ask for content or say it's missing.

Content to summarize:
${contentToSummarize}`;

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
    const summary = response.text();

    if (!summary || summary.trim().length === 0) {
      throw new Error('Empty response from AI model');
    }

    // Check if the response is just asking for content (error case)
    if (summary.toLowerCase().includes('document content was not provided') || 
        summary.toLowerCase().includes('please provide the document')) {
      throw new Error('Failed to process document. The PDF may be empty or unreadable.');
    }

    return summary;
  } catch (error) {
    console.error('Summary generation error:', error);
    throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
