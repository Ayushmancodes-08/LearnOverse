/**
 * Utility functions for optimized cache management
 */

import { SummaryCacheEntry } from './summary-types';

/**
 * Manage cache size with LRU (Least Recently Used) eviction strategy
 * Optimized to handle cache operations efficiently
 */
export const manageCacheSize = (
  cache: Map<string, SummaryCacheEntry>,
  maxSize: number
): void => {
  if (cache.size < maxSize) {
    return; // No need to evict
  }

  // Find and remove the oldest entry (LRU)
  let oldestKey: string | null = null;
  let oldestTime = Infinity;

  // Single pass to find oldest entry
  for (const [key, entry] of cache.entries()) {
    const entryTime = entry.timestamp.getTime();
    if (entryTime < oldestTime) {
      oldestTime = entryTime;
      oldestKey = key;
    }
  }

  if (oldestKey) {
    cache.delete(oldestKey);
  }
};

/**
 * Generate optimized cache key from document hash and options
 * Uses a compact string representation for efficient lookups
 */
export const generateCacheKey = (
  documentHash: string,
  style: string,
  depth: string,
  length: string
): string => {
  // Use compact representation for faster string operations
  return `${documentHash}:${style[0]}${depth[0]}${length[0]}`;
};

/**
 * Simple and fast hash function for document text
 * Uses FNV-1a algorithm for better distribution
 */
export const hashDocument = (text: string): string => {
  // FNV-1a hash parameters
  let hash = 2166136261; // FNV offset basis
  
  // Sample the text for very large documents (performance optimization)
  const sampleSize = 10000;
  const textToHash = text.length > sampleSize 
    ? text.substring(0, sampleSize) + text.substring(text.length - sampleSize)
    : text;

  for (let i = 0; i < textToHash.length; i++) {
    hash ^= textToHash.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  // Convert to base36 for compact representation
  return (hash >>> 0).toString(36);
};

/**
 * Prune cache entries older than specified age
 * Useful for periodic cleanup of stale entries
 */
export const pruneOldEntries = (
  cache: Map<string, SummaryCacheEntry>,
  maxAgeMs: number = 3600000 // Default: 1 hour
): number => {
  const now = Date.now();
  let prunedCount = 0;

  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp.getTime() > maxAgeMs) {
      cache.delete(key);
      prunedCount++;
    }
  }

  return prunedCount;
};

/**
 * Get cache statistics for monitoring
 */
export interface CacheStats {
  size: number;
  oldestEntryAge: number;
  newestEntryAge: number;
  averageEntryAge: number;
}

export const getCacheStats = (cache: Map<string, SummaryCacheEntry>): CacheStats => {
  if (cache.size === 0) {
    return {
      size: 0,
      oldestEntryAge: 0,
      newestEntryAge: 0,
      averageEntryAge: 0,
    };
  }

  const now = Date.now();
  let oldestAge = 0;
  let newestAge = Infinity;
  let totalAge = 0;

  for (const entry of cache.values()) {
    const age = now - entry.timestamp.getTime();
    oldestAge = Math.max(oldestAge, age);
    newestAge = Math.min(newestAge, age);
    totalAge += age;
  }

  return {
    size: cache.size,
    oldestEntryAge: oldestAge,
    newestEntryAge: newestAge,
    averageEntryAge: totalAge / cache.size,
  };
};
