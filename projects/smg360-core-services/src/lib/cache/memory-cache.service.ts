import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { BaseCacheService } from './base-cache.service';
import { CacheEntry } from './cache-entry.model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppSettingsService } from '../app-settings.service';
import { AccountService } from '../account.service';

export const CLEAR_ON_REDIRECT = new InjectionToken<boolean>('CLEAR_ON_REDIRECT');

@Injectable({
  providedIn: 'root',
})
export class MemoryCacheService extends BaseCacheService {
  private cache = new Map<string, CacheEntry<unknown>>();

  constructor(
    _appConfigService: AppSettingsService,
    _accountService: AccountService,
    router: Router,
    @Optional() @Inject(CLEAR_ON_REDIRECT) clearOnRedirect: boolean,
  ) {
    super(_appConfigService, _accountService);

    if (clearOnRedirect) {
      router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      ).subscribe(() => this.resetCache());
    }
  }

  protected allKeys(): string[] {
    if (!this.cache) {
      this.cache = new Map<string, CacheEntry<unknown>>();
      return [];
    }
    // return [...this.cache?.keys()];
    return [...(this.cache ? this.cache.keys() : [])];
  }

  removeEntry<T>(key: string): CacheEntry<T> {
    // grab the entry before we delete it
    const entry = this.retrieveEntry(key);

    // delete it from the map, we don't care about the return type
    this.cache.delete(key);

    return entry as CacheEntry<T>;
  }

  retrieveEntry<T> (key: string): CacheEntry<T> | null {
    // return this.cache.get(key) ?? null
    const entry: CacheEntry<unknown> = this.cache.get(key);
    return entry ? entry as CacheEntry<T> : null;
  }

  storeEntry<T>(key: string, entry: CacheEntry<T>): void {
    this.cache.set(key, entry);
  }
}
