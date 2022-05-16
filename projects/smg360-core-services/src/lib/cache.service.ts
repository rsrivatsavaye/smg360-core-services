import { Injectable } from '@angular/core';
import { CacheType } from './enums/cacheType.enum';
import { UserContainer } from './models/user-container';
import { Not } from './models/not-type';
import { Account } from './models/account.model';
import { Accounts } from './models/accounts.model';
import { Permission } from './models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  // TODO: this needs to be updated to a type
  public cache: any = [];

  constructor() {

  }

  /**
   * Gets a cached item.
   * @param cacheType The cache type to be searched for the desired entry.
   * @param cacheKey The key identifying the desired entry.
   * @returns undefined if no cached entry is found; otherwise, the data cached for the given cache type and key.
   */
  get(cacheType: CacheType.UserMeta, cacheKey: string | number): UserContainer;
  get(cacheType: CacheType.Account, cacheKey: 'all-accounts'): Accounts;
  get(cacheType: CacheType.Account, cacheKey: string | number): Account;
  get(cacheType: CacheType.Permissions, cacheKey: string | number): Permission[];
  get(cacheType: Not<CacheType, CacheType.UserMeta | CacheType.Account>, cacheKey: string | number): any;
  get(cacheType: CacheType, cacheKey: string | number): any { // TODO make return type be unknown. shouldn't be any
    const cacheContext = this.cache[cacheType];
    if (cacheContext) {
      return cacheContext[cacheKey];
    }
    return undefined;
  }

  /**
   * Get all cached entries for this cache type.
   * @param cacheType The cache type to be searched for the desired entry
   * @returns A map of all cached entries
   */
  getCache(cacheType: CacheType): { [key: string]: unknown } {
    return this.cache[cacheType];
  }

  /**
   * Sets a cache entry.
   * @param cacheType type of cache in which the entry is to be stored
   * @param cacheKey cache key used to identify the entry
   * @param cacheValue object to be cached
   */
  set(cacheType: CacheType.UserMeta, cacheKey: string | number, cacheValue: UserContainer);
  set(cacheType: Not<CacheType, CacheType.UserMeta>, cacheKey: string | number, cacheValue: any);
  set(cacheType: CacheType.Account, cacheKey: 'all-accounts', cacheValue: Accounts);
  set(cacheType: CacheType.Account, cacheKey: string | number, cacheValue: Account);
  set(cacheType: CacheType.Permissions, cacheKey: string | number, cacheValue: Permission[]);
  set(cacheType: CacheType, cacheKey: string | number, cacheValue: any) {
    if (!this.cache[cacheType]) {
      this.cache[cacheType] = {};
    }

    this.cache[cacheType][cacheKey] = cacheValue;
  }

  /**
   * Clears a cache for the given type.
   * @param cacheType type of the cache to be cleared
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
  getCacheKey(keySource: unknown): number {
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
      // tslint:disable:no-bitwise
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }
}
