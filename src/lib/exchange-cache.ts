/**
 * TTL-based cache for exchange data.
 * Prices: 30s, Fees: 1hr, Order books: 15s
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ExchangeCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string, ttlMs: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  getTimestamp(key: string): number | null {
    const entry = this.cache.get(key);
    return entry ? entry.timestamp : null;
  }

  clear(): void {
    this.cache.clear();
  }

  /** Remove all entries matching a prefix */
  clearPrefix(prefix: string): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_value, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  get size(): number {
    return this.cache.size;
  }
}

export const exchangeCache = new ExchangeCache();

// TTL constants
export const PRICE_TTL_MS = 30 * 1000;       // 30 seconds
export const FEE_TTL_MS = 60 * 60 * 1000;    // 1 hour
export const ORDERBOOK_TTL_MS = 15 * 1000;   // 15 seconds
