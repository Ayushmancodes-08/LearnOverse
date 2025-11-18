import { SummaryOptions, SummaryCacheEntry } from './summary-types';

/**
 * Generates a simple hash from a string using a basic hash algorithm
 * @param text - The text to hash
 * @returns A hash string in base36 format
 */
export const hashDocument = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

/**
 * Generates a unique cache key from document hash and summary options
 * @param documentHash - The hash of the document content
 * @param options - The summary generation options
 * @returns A unique cache key string
 */
export const generateCacheKey = (documentHash: string, options: SummaryOptions): string => {
  return `${documentHash}-${options.style}-${options.depth}-${options.length}`;
};

/**
 * Manages cache size by removing the oldest entry when max size is reached
 * Uses LRU (Least Recently Used) eviction strategy
 * @param cache - The cache Map to manage
 * @param maxSize - Maximum number of entries allowed in cache
 */
export const manageCacheSize = (cache: Map<string, SummaryCacheEntry>, maxSize: number): void => {
  if (cache.size >= maxSize) {
    // Find and remove the oldest entry based on timestamp
    const oldestKey = Array.from(cache.entries())
      .sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime())[0][0];
    cache.delete(oldestKey);
  }
};

/**
 * Retrieves a cached summary if it exists
 * @param cache - The cache Map to search
 * @param documentHash - The hash of the document
 * @param options - The summary options to match
 * @returns The cached summary string or null if not found
 */
export const getCachedSummary = (
  cache: Map<string, SummaryCacheEntry>,
  documentHash: string,
  options: SummaryOptions
): string | null => {
  const cacheKey = generateCacheKey(documentHash, options);
  const entry = cache.get(cacheKey);
  return entry ? entry.summary : null;
};

/**
 * Caches a summary with the given document hash and options
 * Automatically manages cache size using LRU eviction
 * @param cache - The cache Map to store in
 * @param documentHash - The hash of the document
 * @param options - The summary options used
 * @param summary - The summary text to cache
 * @param maxSize - Maximum cache size (default: 5)
 */
export const cacheSummary = (
  cache: Map<string, SummaryCacheEntry>,
  documentHash: string,
  options: SummaryOptions,
  summary: string,
  maxSize: number = 5
): void => {
  // Manage cache size before adding new entry
  manageCacheSize(cache, maxSize);
  
  const cacheKey = generateCacheKey(documentHash, options);
  const entry: SummaryCacheEntry = {
    documentHash,
    options,
    summary,
    timestamp: new Date(),
  };
  
  cache.set(cacheKey, entry);
};
