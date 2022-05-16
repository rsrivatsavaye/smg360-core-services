import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AccountUtilityService } from './account-utility.service';
import { CacheService } from './cache.service';
import { CacheType } from './enums/cacheType.enum';
import { EntityType } from './enums/entity-type.enum';
import { PermissionService } from './permission.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateLoaderService } from './translate-loader.service';
import { AppSettingsService } from './app-settings.service';
import { LocalStorageService } from './local-storage.service';
import jwt_decode from 'jwt-decode';
import { UserContainer } from './models/user-container';
import { UserExists } from './models/user-exists';
import { UserDetails } from './models/user-details';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userCacheKey = 'current-user';
  adminUserCacheKey = 'current-admin-user';
  isAdmin = false;
  isInternalUser = false;

  constructor(
    private http: HttpClient,
    private accountUtilityService: AccountUtilityService,
    private permissionService: PermissionService,
    private cacheService: CacheService,
    private translateLoaderService: TranslateLoaderService,
    private translate: TranslateService,
    private appSettingsService: AppSettingsService,
    private localStorageService: LocalStorageService
  ) {
  }

  initService() {
    return this.getAdminUser().pipe(tap(user => {
      this.isAdmin = user.isAdmin as boolean;
      const auth: any = this.localStorageService.getObjectItem('authorizationData');
      const groupIdCanAccessToAdmin = [this.appSettingsService.getSetting('groups').internalUser];
      const jwtDecoded: any = jwt_decode(auth.token);
      // get list group id from token claim, if the user have only one group the type of the group_id will be a string,
      // otherwise it will be string array
      const jwtGroup = jwtDecoded.group_id ? (typeof (jwtDecoded.group_id) === 'string'
        ? [jwtDecoded.group_id]
        : jwtDecoded.group_id) : [];
      this.isInternalUser = jwtGroup.filter(g => groupIdCanAccessToAdmin.indexOf(g) >= 0).length > 0;
    }));
  }

  activate() {
    const timezoneOffset = -(new Date('2015-01-01').getTimezoneOffset());
  }

  getCachedUser(): UserContainer {
    return this.cacheService.get(CacheType.UserMeta, this.userCacheKey);
  }

  getCachedAdminUser(): UserContainer {
    return this.cacheService.get(CacheType.UserMeta, this.adminUserCacheKey);
  }

  setCurrentUser(user: UserContainer) {
    this.cacheService.set(CacheType.UserMeta, this.userCacheKey, user);
  }

  setAdminUser(user: UserContainer) {
    this.cacheService.set(CacheType.UserMeta, this.adminUserCacheKey, user);
  }

  getAdminUser(): Observable<UserContainer> {
    let currentUser = this.cacheService.get(CacheType.UserMeta, this.adminUserCacheKey);
    if (currentUser) {
      return new Observable((observer) => observer.next(currentUser));
    }

    let isAdmin = false;

    return this.getCurrent().pipe(
      take(1),
      switchMap((user: UserContainer) => {
        return this.permissionService.getPermissionsByObjectId(EntityType.Account, null).pipe(map((permission) => {
          if (permission.canUpdate) {
            isAdmin = true;
          }
          user.isAdmin = isAdmin;
          currentUser = user;
          this.setAdminUser(user);
          this.translateLoaderService.loadAdminTemplate();
          return user;
        }));
      }),
    );
  }

  getCurrentUser(): Observable<UserContainer> {
    let currentUser = this.getCachedUser();

    if (currentUser) {
      return of(currentUser);
    }
    return this.getCurrent().pipe(
      take(1),
      switchMap((user) => {
        currentUser = user;

        const keys = Object.keys(user.accounts ?? {});
        if (user.accounts && user.accounts instanceof Object && keys.length !== 0 && user.accounts[keys[0]]) {
          const defaultUserAccount = user.accounts[keys[0]];
          this.accountUtilityService.setSelectedAccount(defaultUserAccount.account);
          return this.translateLoaderService.loadAccountTemplate(defaultUserAccount.account.id)
            .pipe(map(_ => {
              this.setCurrentUser(user);
              return user;
            }));
        } else {
          throw Error('No Accounts for user');
        }
      }),
    );
  }

  private getCurrent(): Observable<UserContainer> {
    return this.http.get<any>('/api/user/current');
  }

  getGroupUsers(groupId: string | number): Observable<UserExists[]> {
    return this.http.get<any>(`/api/user/groupUsers/${groupId}`);
  }

  createUsers(usersCreateRequest: any): Observable<UserDetails[]> {
    return this.http.post<any>('/api/user/create', usersCreateRequest);
  }
}
