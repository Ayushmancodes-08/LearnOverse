import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiKeyManager } from './api-key-manager';
import { SummaryOptions, SummaryStyle, SummaryDepth, SummaryLength } from './summary-types';
import { 
  validateDocumentSize, 
  validateSummaryResponse, 
  createSummaryError,
  MAX_DOCUMENT_SIZE 
} from './summary-error-handler';

// --- HELPERS ---

/**
 * Clean text by removing noise (TOC, headers, footers, page numbers, etc.)
 */
function cleanTextContent(text: string): string {
  return text
    // Remove page numbers and headers/footers (e.g., "Page 1 of 10", "© 2024")
    .replace(/^.*?Page \d+.*?$/gm, '')
    .replace(/^.*?©.*?$/gm, '')
    // Remove table of contents markers
    .replace(/Table of Contents[\s\S]*?(?=\n\n|\n[A-Z])/i, '')
    // Remove excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Formats base64 data for the Gemini API inlineData requirement
 */
function fileToGenerativePart(base64Data: string, mimeType: string) {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
}

/**
 * Execute a Gemini API call with automatic key rotation on failure
 */
async function executeWithRetry<T>(
  operation: (genAI: GoogleGenerativeAI) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const apiKey = apiKeyManager.getCurrentKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      const result = await operation(genAI);
      
      apiKeyManager.markCurrentKeySuccess();
      return result;
    } catch (error: any) {
      lastError = error;
      const errorMessage = error?.message || String(error);
      
      // Retry on Rate Limit (429) or Server Error (503)
      const shouldRetry = 
        errorMessage.includes('429') || 
        errorMessage.includes('503') ||
        errorMessage.toLowerCase().includes('quota') ||
        errorMessage.toLowerCase().includes('resource_exhausted');

      if (shouldRetry && attempt < maxRetries - 1) {
        console.warn(`Gemini API Retry ${attempt + 1}/${maxRetries} due to: ${errorMessage}`);
        apiKeyManager.markCurrentKeyFailed(error);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

// --- OCR / TEXT EXTRACTION ---

/**
 * Converts Image-based PDFs or Images to clean text.
 * Call this when standard PDF parsers fail or return empty strings.
 * * @param base64Data - The base64 string of the file (pure string, remove 'data:application/pdf;base64,' prefix)
 * @param mimeType - 'application/pdf', 'image/png', 'image/jpeg', etc.
 */
export const convertScannedDocumentToText = async (base64Data: string, mimeType: string = 'application/pdf'): Promise<string> => {
  return executeWithRetry(async (genAI) => {
    // Gemini 2.5 Flash is highly optimized for Vision/PDF tasks
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
    });

    const prompt = `
      You are a professional OCR (Optical Character Recognition) engine.
      
      **TASK:** Transcribe the content of this document exactly as it appears, but formatted in clean Markdown.
      
      **RULES:**
      1. **Text Only:** Output ONLY the extracted text content. No conversational filler.
      2. **Structure:** Preserve headers, paragraphs, and lists using Markdown (#, -, 1.).
      3. **Correction:** Fix obvious scanning errors (e.g., "th1s" -> "this") based on context.
      4. **Clean:** Do not transcribe page numbers, header/footer artifacts, or watermarks.
      5. **Tables:** If there are tables, represent them reasonably well in Markdown.
    `;

    const filePart = fileToGenerativePart(base64Data, mimeType);

    // Pass both the prompt and the file part to the model
    const result = await model.generateContent([prompt, filePart]);
    const text = result.response.text();
    
    // Run the text cleaner to ensure consistency
    return cleanTextContent(text);
  });
};

// --- CONTENT GENERATORS ---

export const generateMindmap = async (text: string): Promise<string> => {
  return executeWithRetry(async (genAI) => {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.4,
        topP: 0.85,
      }
    });

    const maxChars = 500000; 
    const cleanedText = cleanTextContent(text);
    const saneText = cleanedText.length > maxChars ? cleanedText.substring(0, maxChars) : cleanedText;

    const prompt = `You are an expert knowledge mapper specializing in creating clear, hierarchical visual representations of academic content.

**YOUR TASK:** Create a comprehensive, well-organized markdown mindmap that captures the entire structure and key concepts of this document.

**CRITICAL FILTERING (IGNORE COMPLETELY):**
❌ Table of Contents, page numbers, headers/footers
❌ Exam instructions, marks, time limits, copyright
❌ Acknowledgements, disclaimers, references
❌ Administrative or formatting content

**FOCUS ON:**
✅ Main topics and subtopics
✅ Key concepts and definitions
✅ Important relationships
✅ Critical details and examples
✅ Hierarchical organization of content

**MINDMAP STRUCTURE RULES:**
1. Start with ONE main topic at the top (# level)
2. Break into 3-8 major subtopics (## level)
3. Each subtopic should have 3-7 key concepts (### level)
4. Use #### for sub-concepts when needed
5. Use bullet points (-) for details, examples, or related points
6. Keep each node concise (5-10 words max)
7. Show logical flow and relationships

**EXAMPLE FORMAT:**
# Main Subject
## Major Topic 1
### Key Concept A
- Important detail
- Related point
### Key Concept B
- Detail 1
- Detail 2
#### Sub-concept
- Specific point

## Major Topic 2
### Key Concept C
- Detail
### Key Concept D
- Detail

[Continue for all major topics...]

Document Content:
${saneText}

Generate ONLY the markdown mindmap. No explanations, preamble, or additional text.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  });
};

// --- SUMMARY PROMPT TEMPLATES ---

/**
 * Prompt templates for different summary styles
 */
const STYLE_TEMPLATES: Record<SummaryStyle, string> = {
  conceptual: `Focus on high-level concepts, relationships, and the big picture. Emphasize:
- Overarching themes and main ideas
- How concepts connect and relate to each other
- Theoretical frameworks and models
- Conceptual understanding over technical details
- The "why" behind concepts`,

  mathematical: `Emphasize formulas, equations, and mathematical reasoning. Focus on:
- All mathematical formulas and equations (use proper notation)
- Step-by-step problem-solving approaches
- Mathematical proofs and derivations
- Quantitative relationships and calculations
- Numerical examples and applications`,

  'bullet-points': `Present information in concise, scannable bullet point format. Structure:
- Use clear, hierarchical bullet points
- Keep each point brief (1-2 lines maximum)
- Group related points under topic headers
- Prioritize key facts and takeaways
- Minimize explanatory text`,

  detailed: `Provide comprehensive explanations with examples. Include:
- In-depth explanations of all concepts
- Multiple examples for each topic
- Detailed context and background
- Practical applications and use cases
- Thorough coverage of subtopics and nuances`,
};

/**
 * Depth instructions for different complexity levels
 */
const DEPTH_INSTRUCTIONS: Record<SummaryDepth, string> = {
  basic: `Use simple, accessible language suitable for beginners:
- Avoid technical jargon or define it clearly
- Explain fundamental concepts from the ground up
- Focus on core principles and basic understanding
- Use analogies and simple examples
- Assume minimal prior knowledge`,

  intermediate: `Balance detail with clarity for students with some background:
- Use standard terminology with brief explanations
- Assume foundational knowledge of the subject
- Include moderate technical depth
- Connect concepts to build understanding
- Cover main topics thoroughly`,

  advanced: `Include technical details and advanced concepts for experienced learners:
- Use technical terminology without extensive definitions
- Assume strong foundational knowledge
- Include advanced concepts, edge cases, and nuances
- Discuss complex relationships and implications
- Cover sophisticated applications and theory`,
};

/**
 * Length limits for different summary sizes
 */
const LENGTH_LIMITS: Record<SummaryLength, string> = {
  short: `Create a concise summary (500-800 words):
- Focus ONLY on the most critical points
- Include only essential concepts and definitions
- Limit to 3-5 main topics
- Prioritize breadth over depth
- Omit examples unless absolutely necessary`,

  medium: `Create a balanced summary (1000-1500 words):
- Cover all main topics thoroughly
- Include key concepts with brief explanations
- Provide 1-2 examples per major topic
- Balance comprehensiveness with conciseness
- Include important relationships and connections`,

  long: `Create a comprehensive summary (2000-3000 words):
- Provide extensive coverage of all topics
- Include detailed explanations and multiple examples
- Cover subtopics and related concepts
- Explain relationships and implications thoroughly
- Include practical applications and context`,
};

/**
 * Generate a customized summary with style, depth, and length options
 */
export const generateSummary = async (
  text: string,
  options?: Partial<SummaryOptions>
): Promise<string> => {
  // Validate document size before generation
  const validationError = validateDocumentSize(text);
  if (validationError && !validationError.retryable) {
    throw createSummaryError(validationError);
  }

  // Default options
  const summaryOptions: SummaryOptions = {
    style: options?.style || 'conceptual',
    depth: options?.depth || 'intermediate',
    length: options?.length || 'medium',
  };

  return executeWithRetry(async (genAI) => {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
      }
    });
    
    const cleanedText = cleanTextContent(text);
    // Use MAX_DOCUMENT_SIZE from error handler
    const saneText = cleanedText.length > MAX_DOCUMENT_SIZE 
      ? cleanedText.substring(0, MAX_DOCUMENT_SIZE) 
      : cleanedText;

    // Build dynamic prompt based on customization options
    const styleInstruction = STYLE_TEMPLATES[summaryOptions.style];
    const depthInstruction = DEPTH_INSTRUCTIONS[summaryOptions.depth];
    const lengthInstruction = LENGTH_LIMITS[summaryOptions.length];

    const prompt = `You are an elite academic content analyst and study guide creator. Your summaries are known for being exceptionally clear, well-organized, and highly effective for exam preparation.

**YOUR MISSION:** Transform this document into a powerful study guide that students can use to master the material.

**CRITICAL FILTERING (IGNORE COMPLETELY):**
❌ Table of Contents, page numbers, headers/footers
❌ Exam instructions, marks distribution, time limits
❌ Copyright notices, acknowledgements, legal text
❌ Reference lists, bibliography sections
❌ Any administrative or formatting content

**FOCUS EXCLUSIVELY ON:**
✅ Core educational content and concepts
✅ Key definitions and terminology
✅ Important theories, principles, and frameworks
✅ Practical applications and examples
✅ Relationships between concepts
✅ Critical facts and data points

**CUSTOMIZATION REQUIREMENTS:**

**Style Preference:**
${styleInstruction}

**Depth Level:**
${depthInstruction}

**Length Target:**
${lengthInstruction}

**REQUIRED SUMMARY STRUCTURE:**

# 📚 Document Overview
[2-3 sentences: What is this document about? What's the main purpose/subject?]

# 🎯 Main Topics Covered
[List major topics/chapters with brief descriptions]
- **Topic 1**: Brief description
- **Topic 2**: Brief description
[Continue...]

# 💡 Key Concepts & Definitions
[Organize by topic/chapter. Include most important concepts]

## [Topic/Chapter Name]
- **Concept Name**: Clear, concise definition with context
- **Another Concept**: Definition and why it matters
[Continue for each major topic...]

# 🔗 Important Relationships & Connections
[Explain how key concepts relate to each other]
- How X relates to Y and why this matters
- The connection between A and B
[Key relationships]

# ⚡ Critical Points to Remember
[Bullet list of most important takeaways]
- Point 1: Why it's important
- Point 2: Key insight
[Continue...]

# 📊 Key Facts & Data
[If applicable: Important numbers, dates, statistics, formulas]
- Fact 1
- Fact 2
[Continue...]

# 🎓 Study Tips for This Material
[2-3 practical tips for mastering this content]

**FORMATTING RULES:**
- Use **bold** for ALL key terms and important concepts
- Use *italics* for emphasis on critical points
- Use clear section headers with emojis for visual organization
- Keep explanations concise but complete
- Use bullet points for easy scanning
- Organize logically by topic/chapter when possible
- For mathematical content, use proper notation (e.g., x², √, ∫, etc.)

**QUALITY STANDARDS:**
- Every concept must be clearly explained
- Definitions must be accurate and complete
- Focus on understanding, not just memorization
- Highlight practical applications where relevant
- Make connections between related concepts explicit
- Adhere strictly to the style, depth, and length preferences specified above

Document Content:
${saneText}

Generate a well-structured study guide following ALL customization requirements above.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Validate response using error handler
    const validation = validateSummaryResponse(responseText);
    if (!validation.valid && validation.error) {
      throw createSummaryError(validation.error);
    }

    return responseText;
  });
};

export const chatWithDocument = async (query: string, relevantContext: string): Promise<string> => {
  return executeWithRetry(async (genAI) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const cleanedContext = cleanTextContent(relevantContext);
    const contextWindow = cleanedContext.substring(0, 50000);

    const prompt = `You are a knowledgeable study assistant helping students understand academic material.

**YOUR ROLE:**
- Answer questions based ONLY on the provided document context
- Be clear, concise, and educational
- Explain concepts thoroughly but simply
- Cite specific parts of the document when relevant

**GUIDELINES:**
- If the answer is not in the document, say so clearly
- Ignore page numbers, headers, footers, and formatting artifacts
- Focus on the educational content
- Provide examples if helpful

Document Context:
${contextWindow}

Student Question: ${query}

Provide a clear, helpful answer based on the document.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  });
};

export const generateFlashcards = async (text: string): Promise<Array<{ question: string; answer: string }>> => {
  return executeWithRetry(async (genAI) => {
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
            responseMimeType: "application/json"
        } 
    });

    const maxChars = 500000;
    const cleanedText = cleanTextContent(text);
    const saneText = cleanedText.length > maxChars ? cleanedText.substring(0, maxChars) : cleanedText;

    const prompt = `You are an expert exam preparation specialist. Create high-quality study flashcards from the provided document.

**CRITICAL FILTERING RULES:**
1. COMPLETELY IGNORE: Exam instructions, marks, time limits, TOC, copyright info, page numbers
2. COMPLETELY IGNORE: Acknowledgements, disclaimers, reference lists, headers/footers
3. FOCUS ONLY ON: Actual exam questions, core concepts, definitions, and educational content

**FLASHCARD QUALITY RULES:**
1. **Question Quality:** Each question should test understanding, not just recall
2. **Answer Quality:** Answers should be clear, concise, and complete (2-3 sentences max)
3. **Variety:** Mix question types - definitions, concepts, applications, relationships
4. **Accuracy:** Ensure answers are factually correct based on the document

**QUANTITY:** Generate 15-25 high-quality flashcards

**RESPONSE FORMAT:**
Return a JSON array with this exact structure:
[
  {
    "question": "Clear, specific question?",
    "answer": "Concise, accurate answer with key points."
  }
]

Document Content:
${saneText}

Generate ONLY valid JSON. No explanations or preamble.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      // Try to parse the response
      const flashcards = JSON.parse(responseText);
      const cardArray = Array.isArray(flashcards) ? flashcards : (flashcards.flashcards || flashcards.cards || []);

      if (!Array.isArray(cardArray) || cardArray.length === 0) {
         throw new Error('Model returned empty or invalid JSON structure');
      }

      // Validate each card has required fields
      const validCards = cardArray.filter(
        (card: any) => card && typeof card === 'object' && card.question && card.answer
      );

      if (validCards.length === 0) {
        throw new Error('No valid flashcards found in response');
      }

      return validCards;
    } catch (parseError) {
      console.error("Flashcard JSON Parse Error:", parseError);
      throw new Error('Failed to generate valid flashcards. Please try again.');
    }
  });
};