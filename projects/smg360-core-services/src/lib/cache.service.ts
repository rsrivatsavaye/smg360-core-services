import { Injectable } from '@angular/core';
import { CacheType } from './enums/cacheType.enum';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  //TODO: this needs to be updated to a type
  public cache: any = [];

  constructor() {

  }
  /**
  * Gets a cached item.
  * @param {CacheType} cacheType The cache type to be searched for the desired entry.
  * @param {string} cacheKey The key identifying the desired entry.
  * @returns {Object<>} undefined if no cached entry is found; otherwise, the data cached for the given cache type and key.
  */
  get(cacheType, cacheKey) {
    const cacheContext = this.cache[cacheType];
    if (cacheContext) {
      return cacheContext[cacheKey];
    }
    return undefined;
  }

  /**
   * Get all cached entries for this cache type.
   * @param {CacheType} cacheType The cache type to be searched for the desired entry.
   * @returns {Object<>} A map of all cached entries.
   */
  getCache(cacheType) {
    return this.cache[cacheType];
  }

  /**
   * Sets a cache entry.
   * @param {CacheType} cacheType The type of cache in which the entry is to be stored.
   * @param {number} cacheKey The cache key used to identify the entry.
   * @param {Object<>} cacheValue The object to be cached.
   */
  set(cacheType, cacheKey, cacheValue) {
    if (!this.cache[cacheType]) {
      this.cache[cacheType] = {};
    }

    this.cache[cacheType][cacheKey] = cacheValue;
  }

  /**
   * Clears a cache for the given type.
   * @param {CacheType} cacheType The type of the cache to be cleared.
   */
  clear(cacheType) {
    this.cache[cacheType] = {};
  }

  /**
   * Clears all cached entries.
   */
  clearAll() {
    this.cache = {};
    this.cache[CacheType.Measure] = {};
    this.cache[CacheType.Source] = {};
  }

  /**
   * Builds a cache key used to identify a cache entry for the given object.
   * @param {Object<>} keySource The source object to be used to generate a cache key.
   * @returns {number} A cache key for the given key source.
   */
  getCacheKey(keySource) {
    const jsonObject = JSON.stringify(keySource);

    let hash = 0;
    let i;
    let chr;
    let len;

    if (jsonObject.length === 0) {
      return hash;
    }

    for (i = 0, len = jsonObject.length; i < len; i++) {
      chr = jsonObject.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }
}
