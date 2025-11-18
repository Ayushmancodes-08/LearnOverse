/**
 * Text Formatting Utilities
 * Converts markdown-style formatting to HTML for rich text rendering
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes potentially dangerous tags and attributes
 */
function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  let sanitized = div.innerHTML;

  // Allow only safe tags: strong, em, br, p, span
  const allowedTags = ['strong', 'em', 'br', 'p', 'span'];
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

  sanitized = sanitized.replace(tagRegex, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match;
    }
    return '';
  });

  // Remove event handlers and dangerous attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  return sanitized;
}

/**
 * Convert markdown-style formatting to HTML
 * Supports:
 * - **text** or __text__ for bold
 * - *text* or _text_ for italic
 */
export function formatText(text: string): string {
  if (!text) return '';

  let formatted = text;

  // Convert **text** to <strong>text</strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert __text__ to <strong>text</strong>
  formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Convert *text* to <em>text</em> (but not if it's part of **)
  formatted = formatted.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

  // Convert _text_ to <em>text</em> (but not if it's part of __)
  formatted = formatted.replace(/_([^_]+?)_/g, '<em>$1</em>');

  // Sanitize the result
  return sanitizeHtml(formatted);
}

/**
 * Parse formatted text into segments with formatting info
 * Returns an array of segments with type and content
 */
export function parseFormattedText(text: string): Array<{ type: 'text' | 'bold' | 'italic'; content: string }> {
  if (!text) return [];

  const result: Array<{ type: 'text' | 'bold' | 'italic'; content: string }> = [];
  let lastIndex = 0;

  // Pattern to match **text**, __text__, *text*, _text_
  const pattern = /(\*\*|__)(.*?)\1|(\*|_)([^*_]+?)\3/g;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      result.push({
        type: 'text',
        content: text.substring(lastIndex, match.index),
      });
    }

    // Add the formatted segment
    if (match[1]) {
      // Bold: **text** or __text__
      result.push({
        type: 'bold',
        content: match[2],
      });
    } else if (match[3]) {
      // Italic: *text* or _text_
      result.push({
        type: 'italic',
        content: match[4],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  return result.length > 0 ? result : [{ type: 'text', content: text }];
}

/**
 * Strip markdown formatting from text
 * Useful for plain text display
 */
export function stripFormatting(text: string): string {
  if (!text) return '';

  let stripped = text;

  // Remove **text** and __text__
  stripped = stripped.replace(/\*\*(.*?)\*\*/g, '$1');
  stripped = stripped.replace(/__(.+?)__/g, '$1');

  // Remove *text* and _text_
  stripped = stripped.replace(/\*([^*]+?)\*/g, '$1');
  stripped = stripped.replace(/_([^_]+?)_/g, '$1');

  return stripped;
}

/**
 * Check if text contains any formatting
 */
export function hasFormatting(text: string): boolean {
  if (!text) return false;
  return /(\*\*|__|_|[*])/.test(text);
}

/**
 * Validate and clean text for flashcard content
 */
export function validateFlashcardText(text: string): string {
  if (!text) return '';

  // Trim whitespace
  let cleaned = text.trim();

  // Remove excessive line breaks (more than 2 consecutive)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Remove leading/trailing whitespace from each line
  cleaned = cleaned
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  return cleaned;
}

/**
 * Truncate text to a maximum length while preserving words
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}
