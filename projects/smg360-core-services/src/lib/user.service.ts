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
import { Permission } from './models/permission.model';
import { isObject } from './utils/object-utils';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';

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
    private localStorageService: LocalStorageService,
    private cookieService: CookieService
  ) {
  }

  initService() {
    return this.getAdminUser().pipe(tap(user => {
      this.isAdmin = user.isAdmin as boolean;
      const groupIdCanAccessToAdmin = [this.appSettingsService.getSetting('groups').internalUser];
      const jwtDecoded = this.getToken();
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

  getCachedUser() {
    return this.cacheService.get(CacheType.UserMeta, this.userCacheKey);
  }

  getCachedAdminUser() {
    return this.cacheService.get(CacheType.UserMeta, this.adminUserCacheKey);
  }

  setCurrentUser(user) {
    this.cacheService.set(CacheType.UserMeta, this.userCacheKey, user);
  }

  setAdminUser(user) {
    this.cacheService.set(CacheType.UserMeta, this.adminUserCacheKey, user);
  }

  getAdminUser() {
    const currentUser = this.cacheService.get(CacheType.UserMeta, this.adminUserCacheKey);
    if (currentUser) {
      return of(currentUser);
    }

    let isAdmin = false;

    return this.getCurrent().pipe(
      take(1),
      switchMap((user) => {
        return this.permissionService.getPermissionsByObjectId(EntityType.Account, null).pipe(
          map((permission: Permission) => {
            if (permission.canUpdate) {
              isAdmin = true;
            }
            user.isAdmin = isAdmin;
            this.setAdminUser(user);
            this.translateLoaderService.loadAdminTemplate();
            return user;
          }),
        );
      }),
    );
  }

  getCurrentUser() {
    const currentUser = this.getCachedUser();
    if (currentUser) {
      return of(currentUser);
    }

    return this.getCurrent().pipe(
      take(1),
      switchMap((user) => {
        const keys = Object.keys(user.accounts ?? {});
        if (isObject(user.accounts) && keys.length !== 0 && user.accounts[keys[0]]) {
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

  getAuthClientId(): string {
    return this.getToken().client_id;
  }

  getGroupUsers(groupId: string | number): Observable<any> {
    return this.http.get<any>(`/api/user/groupUsers/${groupId}`);
  }

  createUsers(usersCreateRequest: any): Observable<any> {
    return this.http.post<any>('/api/user/create', usersCreateRequest);
  }

  private getCurrent(): Observable<any> {
    return this.http.get<any>('/api/user/current');
  }

  private getToken(): any {
    const auth: any = this.cookieService.getAuthToken();
    // this.localStorageService.getObjectItem(AuthenticationService.AUTH_DATA_KEY);
    return jwt_decode(auth.token);
  }
}
