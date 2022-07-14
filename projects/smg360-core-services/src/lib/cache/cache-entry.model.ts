import { Observable } from 'rxjs';
export interface CacheEntry<T> {
  data: Observable<T>;
  expiration: number;
}

export interface LocalStorageCacheEntry<T> extends Omit<CacheEntry<T>, 'data'> {
  data: T;
  expiration: number;
}

export interface SessionStorageCacheEntry<T> extends Omit<CacheEntry<T>, 'data'> {
  data: T;
  expiration: number;
}