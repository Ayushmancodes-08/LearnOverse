/**
 * Simple rate limiter to prevent hitting API quota
 * Ensures minimum delay between API calls
 */

class RateLimiter {
  private lastCallTime: number = 0;
  private readonly minDelay: number;
  private callCount: number = 0;
  private windowStart: number = Date.now();
  private readonly maxCallsPerMinute: number;

  constructor(minDelayMs: number = 1000, maxCallsPerMinute: number = 50) {
    this.minDelay = minDelayMs;
    this.maxCallsPerMinute = maxCallsPerMinute;
  }

  /**
   * Wait if necessary to respect rate limits
   */
  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now - this.windowStart > 60000) {
      this.callCount = 0;
      this.windowStart = now;
    }

    // Check if we've hit the per-minute limit
    if (this.callCount >= this.maxCallsPerMinute) {
      const waitTime = 60000 - (now - this.windowStart);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.callCount = 0;
        this.windowStart = Date.now();
      }
    }

    // Ensure minimum delay between calls
    const timeSinceLastCall = now - this.lastCallTime;
    if (timeSinceLastCall < this.minDelay) {
      const delay = this.minDelay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    this.lastCallTime = Date.now();
    this.callCount++;
  }

  /**
   * Get current rate limit status
   */
  getStatus(): { callsThisMinute: number; maxCalls: number; resetIn: number } {
    const now = Date.now();
    const resetIn = Math.max(0, 60000 - (now - this.windowStart));
    
    return {
      callsThisMinute: this.callCount,
      maxCalls: this.maxCallsPerMinute,
      resetIn: Math.ceil(resetIn / 1000),
    };
  }
}

// Singleton instance
// Free tier: ~60 requests per minute, we'll be conservative with 50
export const rateLimiter = new RateLimiter(1000, 50);
