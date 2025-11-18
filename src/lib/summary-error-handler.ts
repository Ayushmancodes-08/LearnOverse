import { SummaryError, SummaryErrorType } from './summary-types';

/**
 * Maximum document size for summary generation (characters)
 */
export const MAX_DOCUMENT_SIZE = 500000;

/**
 * Minimum document size for summary generation (characters)
 */
export const MIN_DOCUMENT_SIZE = 100;

/**
 * Maximum retry attempts for exponential backoff
 */
export const MAX_RETRY_ATTEMPTS = 3;

/**
 * Base delay for exponential backoff (milliseconds)
 */
export const BASE_RETRY_DELAY = 1000;

/**
 * Validate document size before generation
 */
export function validateDocumentSize(text: string): SummaryError | null {
  if (!text || text.trim().length === 0) {
    return {
      type: SummaryErrorType.EMPTY_DOCUMENT,
      message: 'Please upload a document before generating a summary.',
      retryable: false,
    };
  }

  if (text.length < MIN_DOCUMENT_SIZE) {
    return {
      type: SummaryErrorType.EMPTY_DOCUMENT,
      message: `Document is too short (${text.length} characters). Please upload a document with at least ${MIN_DOCUMENT_SIZE} characters.`,
      retryable: false,
    };
  }

  if (text.length > MAX_DOCUMENT_SIZE) {
    return {
      type: SummaryErrorType.DOCUMENT_TOO_LARGE,
      message: `Document is too large (${text.length} characters). Maximum size is ${MAX_DOCUMENT_SIZE} characters. The first ${MAX_DOCUMENT_SIZE} characters will be used.`,
      retryable: true,
    };
  }

  return null;
}

/**
 * Detect error type from error object or message
 */
export function detectErrorType(error: any): SummaryErrorType {
  const errorMessage = error?.message || String(error);
  const errorString = errorMessage.toLowerCase();

  // Network errors
  if (
    errorString.includes('network') ||
    errorString.includes('fetch') ||
    errorString.includes('connection') ||
    errorString.includes('offline') ||
    error?.name === 'NetworkError' ||
    error?.code === 'ECONNREFUSED'
  ) {
    return SummaryErrorType.NETWORK_ERROR;
  }

  // API errors (rate limits, quota, authentication)
  if (
    errorString.includes('429') ||
    errorString.includes('quota') ||
    errorString.includes('rate limit') ||
    errorString.includes('resource_exhausted') ||
    errorString.includes('api key') ||
    errorString.includes('authentication') ||
    errorString.includes('unauthorized') ||
    errorString.includes('403') ||
    errorString.includes('401')
  ) {
    return SummaryErrorType.API_ERROR;
  }

  // Invalid response errors
  if (
    errorString.includes('empty') ||
    errorString.includes('invalid') ||
    errorString.includes('parse') ||
    errorString.includes('malformed') ||
    errorString.includes('unexpected')
  ) {
    return SummaryErrorType.INVALID_RESPONSE;
  }

  // Default to API error for unknown errors
  return SummaryErrorType.API_ERROR;
}

/**
 * Create a user-friendly error message based on error type
 */
export function createErrorMessage(errorType: SummaryErrorType, originalError?: any): string {
  const errorMessages: Record<SummaryErrorType, string> = {
    [SummaryErrorType.API_ERROR]: 
      'Unable to generate summary due to an API issue. This could be due to rate limits or service availability. Please try again in a few moments.',
    
    [SummaryErrorType.NETWORK_ERROR]: 
      'Network connection error. Please check your internet connection and try again.',
    
    [SummaryErrorType.INVALID_RESPONSE]: 
      'The AI generated an invalid response. Please try again with different customization options.',
    
    [SummaryErrorType.DOCUMENT_TOO_LARGE]: 
      `Document exceeds the maximum size of ${MAX_DOCUMENT_SIZE} characters. Only the first ${MAX_DOCUMENT_SIZE} characters will be summarized.`,
    
    [SummaryErrorType.EMPTY_DOCUMENT]: 
      'No document content available. Please upload a document first.',
  };

  let message = errorMessages[errorType];

  // Add original error details for debugging (in development)
  if (originalError && process.env.NODE_ENV === 'development') {
    const errorDetail = originalError?.message || String(originalError);
    message += ` (Debug: ${errorDetail})`;
  }

  return message;
}

/**
 * Determine if an error is retryable
 */
export function isErrorRetryable(errorType: SummaryErrorType): boolean {
  switch (errorType) {
    case SummaryErrorType.API_ERROR:
    case SummaryErrorType.NETWORK_ERROR:
    case SummaryErrorType.INVALID_RESPONSE:
    case SummaryErrorType.DOCUMENT_TOO_LARGE:
      return true;
    
    case SummaryErrorType.EMPTY_DOCUMENT:
      return false;
    
    default:
      return false;
  }
}

/**
 * Create a SummaryError object from any error
 */
export function createSummaryError(error: any): SummaryError {
  const errorType = detectErrorType(error);
  const message = createErrorMessage(errorType, error);
  const retryable = isErrorRetryable(errorType);

  return {
    type: errorType,
    message,
    retryable,
  };
}

/**
 * Calculate delay for exponential backoff
 */
export function calculateBackoffDelay(attempt: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, etc.
  return BASE_RETRY_DELAY * Math.pow(2, attempt);
}

/**
 * Sleep utility for retry delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute an operation with exponential backoff retry logic
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    onRetry?: (attempt: number, error: any) => void;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts || MAX_RETRY_ATTEMPTS;
  const shouldRetry = options.shouldRetry || ((error: any) => {
    const errorType = detectErrorType(error);
    return isErrorRetryable(errorType);
  });

  let lastError: any;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (!shouldRetry(error) || attempt === maxAttempts - 1) {
        throw error;
      }

      // Notify about retry
      if (options.onRetry) {
        options.onRetry(attempt + 1, error);
      }

      // Wait before retrying with exponential backoff
      const delay = calculateBackoffDelay(attempt);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Validate and sanitize summary response
 */
export function validateSummaryResponse(response: string): { valid: boolean; error?: SummaryError } {
  // Check if response is empty
  if (!response || response.trim().length === 0) {
    return {
      valid: false,
      error: {
        type: SummaryErrorType.INVALID_RESPONSE,
        message: 'The AI returned an empty response. Please try again.',
        retryable: true,
      },
    };
  }

  // Check if response is too short (likely an error message)
  if (response.trim().length < 50) {
    return {
      valid: false,
      error: {
        type: SummaryErrorType.INVALID_RESPONSE,
        message: 'The AI returned an incomplete response. Please try again.',
        retryable: true,
      },
    };
  }

  // Check for basic markdown structure (at least one header)
  if (!response.includes('#')) {
    console.warn('Summary response may not have proper markdown structure');
    // Don't fail, just warn
  }

  return { valid: true };
}
