import { Injectable } from '@angular/core';
import { BaseCacheService } from './base-cache.service';
import { CacheEntry, SessionStorageCacheEntry } from './cache-entry.model';
import * as _ from 'lodash';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppSettingsService } from '../app-settings.service';
import { AccountService } from '../account.service';

@Injectable({
    providedIn: 'root'
})
export class SessionCacheService extends BaseCacheService {
    private static readonly KEYS_KEY = 'session-storage-cached-keys';
    private keys: Array<string> = [];

    constructor(
        _appConfigService: AppSettingsService,
        _accountService: AccountService,
    ) {
        super(_appConfigService, _accountService);

        // grab them out of sessionStorage
        const rawKeys: string = sessionStorage.getItem(SessionCacheService.KEYS_KEY);
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

        sessionStorage.removeItem(key);

        return entry;
    }

    retrieveEntry<T>(key: string): CacheEntry<T> {
        // try to grab the item from sessionStorage
        const rawItem: string = sessionStorage.getItem(key);
        if (rawItem === null) {
            // if it doesn't exist, return null
            return null;
        }

        // attempt to parse it. if this fails, we have other problems to worry about
        const parsedItem: SessionStorageCacheEntry<T> = JSON.parse(rawItem);
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
        entry.data.subscribe(res => {
            this.updateStoredKeys(key, true);
            const lsEntry: SessionStorageCacheEntry<T> = {
                data: res,
                expiration: entry.expiration
            };
            // write the actual entry to sessionStorage
            sessionStorage.setItem(key, JSON.stringify(lsEntry));
        });
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
        sessionStorage.setItem(SessionCacheService.KEYS_KEY, JSON.stringify(this.keys));
    }
}
