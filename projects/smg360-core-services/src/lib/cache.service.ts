import { Injectable } from '@angular/core';
import { CacheType } from './enums/cacheType.enum';
import { UserContainer } from './models/user-container.model';
import { PartialRecord } from './models/partial-record';
import { Indexable } from './models/indexable';
import { EntityType } from './enums/entity-type.enum';
import { Permission } from './models/permission.model';
import { Account } from './models/account.model';
import { Accounts } from './models/accounts.model';
import { ALL_ACCOUNTS_CACHE_KEY } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  public cache: PartialRecord<CacheType, { [key in Indexable]: unknown }> = {};

  constructor() {

  }

  get(cacheType: CacheType.UserMeta, cacheKey: string | number): UserContainer;
  get(cacheType: CacheType.Account, cacheKey: typeof ALL_ACCOUNTS_CACHE_KEY): Accounts;
  get(cacheType: CacheType.Account, cacheKey: string | number): Account;
  get(cacheType: CacheType.Permissions, cacheKey: EntityType): Permission[];
  get(cacheType: CacheType, cacheKey: string | number): unknown;
  /**
   * Gets a cached item.
   * @param cacheType The cache type to be searched for the desired entry.
   * @param cacheKey The key identifying the desired entry.
   * @returns undefined if no cached entry is found; otherwise, the data cached for the given cache type and key.
   */
  get(cacheType: CacheType, cacheKey: string | number): unknown {
    const cacheContext = this.cache[cacheType];
    if (cacheContext) {
      return cacheContext[cacheKey];
    }
    return undefined;
  }

  /**
   * Get all cached entries for this cache type.
   * @param cacheType The cache type to be searched for the desired entry.
   * @returns A map of all cached entries.
   */
  getCache(cacheType: CacheType): { [key: string]: unknown } {
    return this.cache[cacheType];
  }

  set(cacheType: CacheType.UserMeta, cacheKey: string | number, cacheValue: UserContainer);
  set(cacheType: CacheType.Account, cacheKey: typeof ALL_ACCOUNTS_CACHE_KEY, cacheValue: Accounts);
  set(cacheType: CacheType.Account, cacheKey: string | number, cacheValue: Account);
  set(cacheType: CacheType.Permissions, cacheKey: string | number, cacheValue: Permission[]);
  set(cacheType: CacheType, cacheKey: string | number, cacheValue: unknown);
  /**
   * Sets a cache entry.
   * @param cacheType The type of cache in which the entry is to be stored.
   * @param cacheKey The cache key used to identify the entry.
   * @param cacheValue The object to be cached.
   */
  set(cacheType: CacheType, cacheKey: string | number, cacheValue: unknown) {
    if (!this.cache[cacheType]) {
      this.cache[cacheType] = {};
    }

    this.cache[cacheType][cacheKey] = cacheValue;
  }

  /**
   * Clears a cache for the given type.
   * @param cacheType The type of the cache to be cleared.
   */
  clear(cacheType: CacheType) {
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
   * @param keySource The source object to be used to generate a cache key.
   * @returns A cache key for the given key source.
   */
  // tslint:disable:no-bitwise
  getCacheKey(keySource: unknown): number {
    const jsonObject = JSON.stringify(keySource);

    let hash = 0;

    if (jsonObject.length === 0) {
      return hash;
    }

    for (let i = 0, len = jsonObject.length; i < len; i++) {
      const chr = jsonObject.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }

    return hash;
  }
}
