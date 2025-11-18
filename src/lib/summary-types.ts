// Summary customization types
export type SummaryStyle = 'conceptual' | 'mathematical' | 'bullet-points' | 'detailed';
export type SummaryDepth = 'basic' | 'intermediate' | 'advanced';
export type SummaryLength = 'short' | 'medium' | 'long';

// Summary options interface
export interface SummaryOptions {
  style: SummaryStyle;
  depth: SummaryDepth;
  length: SummaryLength;
}

// Summary cache entry interface
export interface SummaryCacheEntry {
  documentHash: string;
  options: SummaryOptions;
  summary: string;
  timestamp: Date;
}

// Summary error types
export enum SummaryErrorType {
  API_ERROR = 'api_error',
  NETWORK_ERROR = 'network_error',
  INVALID_RESPONSE = 'invalid_response',
  DOCUMENT_TOO_LARGE = 'document_too_large',
  EMPTY_DOCUMENT = 'empty_document',
}

// Summary error interface
export interface SummaryError {
  type: SummaryErrorType;
  message: string;
  retryable: boolean;
}
