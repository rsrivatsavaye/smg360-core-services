import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from './cache.service';
import { CacheType } from './enums/cacheType.enum';
import { Observable, of, scheduled, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Accounts } from './models/accounts.model';
import { Account } from "./models/account.model";


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  BaseUrl: string = "";
  constructor(private http: HttpClient, private cacheService: CacheService) {

  }

  getListing(): Observable<Accounts> {
    const allAccountsCacheKey = 'all-accounts';
    const cachedAccountList: Accounts = this.cacheService.get(CacheType.Account, allAccountsCacheKey);

    if (cachedAccountList && cachedAccountList.accounts) {
      return new Observable((observer) => observer.next(cachedAccountList));
    }
    //
    return this.http.get<Array<Account>>(this.BaseUrl + '/api/account/listing')
      .pipe(take(1), map((accounts: Array<Account>) => {
        var allAccounts = Accounts.create();
        accounts.forEach(function (account) {
          allAccounts.add(account.id, account.nameKey, account.type);
        });
        this.cacheService.set(CacheType.Account, allAccountsCacheKey, allAccounts);
        return allAccounts;
      }));

  }
  test() {
    return new Observable(obs => obs.next(1)).pipe(take(1), map((r: number) => r + 1));
  }

  get(accountId: string): Observable<Account> {
    const account: Account = this.cacheService.get(CacheType.Account, accountId);

    if (account) {
      return new Observable((observer) => observer.next(account));
    }

    return this.http.get<Account>(this.BaseUrl + `/api/account/${accountId}`).pipe(take(1), map((account: Account) => {
      this.cacheService.set(CacheType.Account, accountId, account);
      return account;
    }));
  }

  save(account: Account): Observable<Account> {
    return this.http.post<Account>(this.BaseUrl + '/api/account/save', account);
  }

  invalidateCache() {
    this.cacheService.clear(CacheType.Account);
  }

}
