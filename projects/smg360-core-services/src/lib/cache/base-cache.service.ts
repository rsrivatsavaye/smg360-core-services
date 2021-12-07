import * as _ from 'lodash';
import { CacheEntry } from './cache-entry.model';
import { isObservable, Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AppSettingsService } from '../app-settings.service';

/**
 * Cache service that can be used to store data in any manner. Currently, it will only clear expired keys on service
 * reload. Additional logic should be added to streamline the entry expiration process.
 *
 * A throttling mechanism exists and defaults to 60 seconds.
 */
export abstract class BaseCacheService {
  /**
   * Cache time to live in milliseconds
   */
  ttl = 0;

  private throttleCache = new Map<string, {
    timeoutFn: void,
    data$: Observable<any>
  }>();

  constructor(
    appConfigService: AppSettingsService,
  ) {
    const config = appConfigService.getConfig();
    const cacheTimeout = config && config.timeoutSettings ? _.toNumber(config.timeoutSettings.cacheTimeout) : 0;
    this.ttl = typeof cacheTimeout === 'number' && isFinite(cacheTimeout) ? cacheTimeout : 0;
    // clear any existing items when the service initializes
    if (this.allKeys() && this.allKeys().length) {
      this.clearExpiredItems();
    }
  }

  static cacheRequest<T>(
    requestFactory: () => Observable<T>,
    cacheService: BaseCacheService,
    key: string | any,
    keyPrefix: string = 'base-',
    throttleTimeout: number = 60000
  ): Observable<T> {
    const cacheKey: string = keyPrefix + (typeof key === 'string' ? key : JSON.stringify(key));
    const request$ = requestFactory().pipe(shareReplay(1));

    const data$: Observable<T> = cacheService.tryGet<T>(cacheKey);
    if (data$ != null) {
      return data$;
    }

    if (cacheService.throttleCache.has(cacheKey)) {
      return cacheService.throttleCache.get(cacheKey).data$;
    } else {
      cacheService.throttleCache.set(cacheKey, {
        timeoutFn: (() => {setTimeout(() => {
          cacheService.throttleCache.delete(cacheKey);
        }, throttleTimeout)})(),
        data$: request$
      });
    }

    cacheService.save(cacheKey, request$);
    return request$;
  }

  /**
   * Attempts to save the key and data using the cache implementation. Note, if <code>data</code> is null or undefined,
   * it doesn't get saved.
   *
   * @param key Key that uniquely identifies a cache item
   * @param data Data to be saved
   */
  save(key: string, data: unknown) {
    if (this.ttl === 0 || _.isNil(data) || _.isNil(key)) {
      return;
    }

    const isAnObservable = isObservable(data);

    const value: CacheEntry<unknown> = {
      data: isAnObservable ? data as Observable<unknown> : of(data),
      expiration: new Date().getTime() + this.ttl,
    };

    this.storeEntry(key, value);
  }

  /**
   * Tries to get unexpired cached data by key. Returns null if there is no entry for the given key or if the entry has
   * expired.
   *
   * @param key Key that unique identifies a cache item
   */
  tryGet<T>(key: string): Observable<T> | null {
    // no key, no item
    if (key == null) {
      return null;
    }

    const item: CacheEntry<T> = this.retrieveEntry(key);
    if (item === null) {
      return null;
    }

    // if no expiration is set, there's no way to check if the entry is valid
    if (!(!_.isNil(item) && !_.isNil(item.expiration))) {
      return null;
    }

    // if it's expired, remove it and send back null
    if (item.expiration <= new Date().getTime()) {
      this.removeEntry(key);
      return null;
    }

    return item.data;
  }

  /**
   * Clears the expired entries that are stored using this service. In case two service implementations use the same
   * storage system, this will only remove values if they have the same entry type as the service.
   */
  clearExpiredItems() {
    const remove: Array<string> = [];
    const now: number = new Date().getTime();
    for (const key of this.allKeys()) {
      const entry = this.retrieveEntry(key);
      if (_.isNil(entry)) {
        continue;
      }
      if (!_.isNil(entry) && entry.expiration <= now) {
        remove.push(key);
      }
    }
    this.removeEntries(remove);
  }

  /**
   * Removes all entries from the cache.
   */
  resetCache(keyPrefix: string = ''): void {
    // this.removeEntries(this.allKeys().filter(key => key?.startsWith(keyPrefix) ?? false));
    this.removeEntries(this.allKeys().filter(key => key && key.startsWith(keyPrefix)));
  }

  /**
   * Retrieves the entry stored in the cache by the given key. This should return the entry even if it is expired.
   *
   * @param key Key that uniquely identifies a cache item
   */
  abstract retrieveEntry<T>(key: string): CacheEntry<T> | null;

  /**
   * Stores an entry referenced by the given key. By the time this is called, the key and entry are both deemed valid
   * and the TTL value will be non-zero.
   *
   * @param key Key that uniquely identifies a cache item
   * @param entry The entry that needs to be cached
   */
  abstract storeEntry<T>(key: string, entry: CacheEntry<T>): void;

  /**
   * Removes an entry referenced by the given key.
   *
   * @param key Key that uniquely identifies a cache item
   */
  abstract removeEntry<T = unknown>(key: string): CacheEntry<T>;

  /**
   * Returns all keys that are currently being stored by this cache service.
   */
  protected abstract allKeys(): string[];

  protected removeEntries(keys: Array<string>) {
    for (const key of keys) {
      this.removeEntry(key);
    }
  }
}
