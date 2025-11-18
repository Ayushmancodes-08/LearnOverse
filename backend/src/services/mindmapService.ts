import { GoogleGenerativeAI } from '@google/generative-ai';

const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function generateMindmap(documentText: string): Promise<string> {
  try {
    if (!documentText || documentText.trim().length === 0) {
      throw new Error('Document text is empty');
    }

    const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are an expert at creating clear, hierarchical mindmaps from educational content.
Your mindmaps should:
- Start with a main topic as the root (# Main Topic)
- Use ## for major categories/sections
- Use ### for subcategories
- Use - for key points and concepts
- Be concise (2-5 words per bullet point)
- Show relationships and hierarchies clearly
- Include definitions for technical terms
- Highlight important concepts with emphasis
- Be visually scannable and well-organized`;

    const contentToUse = documentText.slice(0, 50000); // Increased from 40000
    
    const userPrompt = `Analyze this educational content and create a comprehensive, well-structured mindmap.

IMPORTANT INSTRUCTIONS:
1. Identify the main topic/subject
2. Break it into 3-5 major categories
3. Under each category, list 3-5 key concepts
4. Use clear hierarchy with proper markdown formatting
5. Make it easy to understand at a glance
6. Include important definitions and relationships

Content to analyze:
${contentToUse}

Generate the mindmap in markdown format:`;

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
    let markdown = response.text();

    if (!markdown || markdown.trim().length === 0) {
      throw new Error('Empty response from AI model');
    }

    // Validate and fix markdown structure
    if (!markdown.includes('#')) {
      throw new Error('Generated mindmap lacks proper markdown structure');
    }

    // Ensure proper formatting
    markdown = markdown
      .split('\n')
      .map(line => {
        // Fix heading levels
        if (line.match(/^#{1,3}\s/)) {
          return line;
        }
        // Fix bullet points
        if (line.trim().startsWith('-')) {
          return line;
        }
        return line;
      })
      .join('\n');

    return markdown;
  } catch (error) {
    console.error('Mindmap generation error:', error);
    throw new Error(`Failed to generate mindmap: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
