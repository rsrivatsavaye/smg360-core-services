import { Injectable } from '@angular/core';
import { BaseCacheService } from './base-cache.service';
import { CacheEntry, LocalStorageCacheEntry } from './cache-entry.model';
import * as _ from 'lodash';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppSettingsService } from '../app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class LocalCacheService extends BaseCacheService {
  private static readonly KEYS_KEY = 'local-storage-cached-keys';

  private keys: Array<string> = [];

  constructor(
    _appConfigService: AppSettingsService,
  ) {
    super(_appConfigService);

    // grab them out of localStorage
    const rawKeys: string = localStorage.getItem(LocalCacheService.KEYS_KEY);
    // attempt to parse it from the stored JSON
    const keys = JSON.parse(rawKeys);
    // only push if the parse is successful and it contains values
    if (Array.isArray(keys) && keys.length !== 0) {
      this.keys.push(...keys);
    }
  }

  removeEntry<T>(key: string): CacheEntry<T> {
    // remove the key from the list
    this.updateStoredKeys(key, false);

    // grab the entry before we delete it
    const entry: CacheEntry<T> = this.retrieveEntry(key);

    localStorage.removeItem(key);

    return entry;
  }

  retrieveEntry<T>(key: string): CacheEntry<T> {
    // try to grab the item from localStorage
    const rawItem: string = localStorage.getItem(key);
    if (rawItem === null) {
      // if it doesn't exist, return null
      return null;
    }

    // attempt to parse it. if this fails, we have other problems to worry about
    const parsedItem: LocalStorageCacheEntry<T> = JSON.parse(rawItem);
    // as a just in case, check if it's null anyway
    if (!_.isNil(parsedItem)) {
      const cacheEntry: CacheEntry<T> = {
        data: of(parsedItem.data as unknown as T),
        expiration: parsedItem.expiration
      };
      return cacheEntry;
    }

    return null;
  }

  storeEntry<T>(key: string, entry: CacheEntry<T>): void {
    entry.data.pipe(
      tap(res => {
        this.updateStoredKeys(key, true);
        const lsEntry: LocalStorageCacheEntry<T> = {
          data: res,
          expiration: entry.expiration
        };
        // write the actual entry to localStorage
        localStorage.setItem(key, JSON.stringify(lsEntry));
      })
    );
  }

  protected allKeys(): Array<string> {
    return this.keys;
  }

  private updateStoredKeys(key: string, add: boolean) {
    if (add) {
      this.keys.push(key);
    } else {
      this.keys = this.keys.filter(val => val === key);
    }
    localStorage.setItem(LocalCacheService.KEYS_KEY, JSON.stringify(this.keys));
  }
}
