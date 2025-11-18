/**
 * API Key Manager with Automatic Rotation and Failover
 * 
 * Features:
 * - Automatic key rotation when rate limits are hit
 * - Failover to backup keys on errors
 * - Tracks failed keys and retries after cooldown
 * - Load balancing across multiple keys
 */

interface KeyStatus {
  key: string;
  failures: number;
  lastFailure: number | null;
  isBlocked: boolean;
}

class APIKeyManager {
  private keys: KeyStatus[] = [];
  private currentIndex: number = 0;
  private readonly MAX_FAILURES = 3;
  private readonly COOLDOWN_PERIOD = 60000; // 1 minute in milliseconds

  constructor() {
    this.loadKeys();
  }

  /**
   * Load all available API keys from environment variables
   */
  private loadKeys(): void {
    const keys: string[] = [];

    // Load primary key
    const primaryKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (primaryKey && primaryKey.trim()) {
      keys.push(primaryKey.trim());
    }

    // Load additional keys (VITE_GOOGLE_API_KEY_2, VITE_GOOGLE_API_KEY_3, etc.)
    let index = 2;
    while (true) {
      const key = import.meta.env[`VITE_GOOGLE_API_KEY_${index}`];
      if (!key || !key.trim()) break;
      keys.push(key.trim());
      index++;
    }

    if (keys.length === 0) {
      throw new Error(
        'No Google API keys configured. Please add VITE_GOOGLE_API_KEY to your .env.local file. ' +
        'See .env.example for configuration details.'
      );
    }

    // Initialize key status tracking
    this.keys = keys.map(key => ({
      key,
      failures: 0,
      lastFailure: null,
      isBlocked: false,
    }));
  }

  /**
   * Get the current active API key
   */
  getCurrentKey(): string {
    // Check if current key is available
    if (!this.isKeyAvailable(this.currentIndex)) {
      // Try to find an available key
      const availableIndex = this.findAvailableKey();
      if (availableIndex === -1) {
        // All keys are blocked, reset the one with oldest failure
        this.resetOldestKey();
      } else {
        this.currentIndex = availableIndex;
      }
    }

    return this.keys[this.currentIndex].key;
  }

  /**
   * Check if a key is available (not blocked or cooled down)
   */
  private isKeyAvailable(index: number): boolean {
    const keyStatus = this.keys[index];
    
    if (!keyStatus.isBlocked) {
      return true;
    }

    // Check if cooldown period has passed
    if (keyStatus.lastFailure) {
      const timeSinceFailure = Date.now() - keyStatus.lastFailure;
      if (timeSinceFailure > this.COOLDOWN_PERIOD) {
        // Reset the key after cooldown
        keyStatus.failures = 0;
        keyStatus.isBlocked = false;
        keyStatus.lastFailure = null;
        return true;
      }
    }

    return false;
  }

  /**
   * Find the next available key
   */
  private findAvailableKey(): number {
    for (let i = 0; i < this.keys.length; i++) {
      if (this.isKeyAvailable(i)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Reset the key with the oldest failure
   */
  private resetOldestKey(): void {
    let oldestIndex = 0;
    let oldestTime = this.keys[0].lastFailure || 0;

    for (let i = 1; i < this.keys.length; i++) {
      const failureTime = this.keys[i].lastFailure || 0;
      if (failureTime < oldestTime) {
        oldestTime = failureTime;
        oldestIndex = i;
      }
    }

    // Reset the oldest key
    this.keys[oldestIndex].failures = 0;
    this.keys[oldestIndex].isBlocked = false;
    this.keys[oldestIndex].lastFailure = null;
    this.currentIndex = oldestIndex;
  }

  /**
   * Mark current key as failed and rotate to next
   */
  markCurrentKeyFailed(error: any): void {
    const keyStatus = this.keys[this.currentIndex];
    keyStatus.failures++;
    keyStatus.lastFailure = Date.now();

    const errorMessage = error?.message || String(error);
    const isRateLimitError = 
      errorMessage.includes('429') || 
      errorMessage.includes('quota') || 
      errorMessage.includes('rate limit');

    // Block key if max failures reached
    if (keyStatus.failures >= this.MAX_FAILURES) {
      keyStatus.isBlocked = true;
    }

    // Rotate to next available key
    this.rotateToNextKey();
  }

  /**
   * Rotate to the next available key
   */
  private rotateToNextKey(): void {
    const startIndex = this.currentIndex;
    
    // Try next keys in sequence
    for (let i = 1; i < this.keys.length; i++) {
      const nextIndex = (startIndex + i) % this.keys.length;
      if (this.isKeyAvailable(nextIndex)) {
        this.currentIndex = nextIndex;
        return;
      }
    }

    // If no available key found, force reset
    this.forceResetOldestKey();
  }

  /**
   * Mark current key as successful (reset failure count)
   */
  markCurrentKeySuccess(): void {
    const keyStatus = this.keys[this.currentIndex];
    if (keyStatus.failures > 0) {
      keyStatus.failures = 0;
      keyStatus.lastFailure = null;
    }
  }

  /**
   * Get status of all keys
   */
  getStatus(): { total: number; available: number; blocked: number } {
    const available = this.keys.filter((_, i) => this.isKeyAvailable(i)).length;
    const blocked = this.keys.filter(k => k.isBlocked).length;
    
    return {
      total: this.keys.length,
      available,
      blocked,
    };
  }

  /**
   * Manually rotate to next key (for load balancing)
   */
  rotateKey(): void {
    const nextIndex = (this.currentIndex + 1) % this.keys.length;
    if (this.isKeyAvailable(nextIndex)) {
      this.currentIndex = nextIndex;
    }
  }
}

// Singleton instance
export const apiKeyManager = new APIKeyManager();
