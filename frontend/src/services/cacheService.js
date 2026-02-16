// cacheService.js - In-memory cache with TTL support

class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes default TTL
  }

  /**
   * Get cached data if not expired
   * @param {string} key - Cache key
   * @returns {any|null} - Cached data or null
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Set cache data with TTL
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} customTTL - Optional custom TTL in milliseconds
   */
  set(key, data, customTTL = null) {
    const expiry = Date.now() + (customTTL || this.ttl);
    this.cache.set(key, { data, expiry });
  }

  /**
   * Clear specific cache key
   * @param {string} key - Cache key to clear
   */
  clear(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.cache.clear();
  }

  /**
   * Check if key exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }
}

// Singleton instance
const cacheService = new CacheService();

export default cacheService;
