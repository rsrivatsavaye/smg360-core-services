import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import {
  AccountUtilityService,
  AppSettingsService,
  LocalStorageService,
  PartialTranslateLoaderService,
  PermissionService,
  UserService
} from '../public-api';
import { CacheService } from './cache.service';
import { CacheType } from './enums/cacheType.enum';
import { TranslateLoaderService } from './translate-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { Permission } from './models/permission.model';
import { UserContainer } from './models/user-container';
import { AccountLite } from './models/account-lite';

describe('UserService', () => {
  let service: UserService;
  const url = '/api/user/current';
  const mockLanguage = 'en-GB';
  const userCacheKey = 'current-user';
  const adminUserCacheKey = 'current-admin-user';
  const user: UserContainer = {
    userId: 33,
    email: 'jasminetest@smg.com',
    accounts: {
      jasminetest36f280f8576fb: {
        account: {
          id: 'jasminetest36f280f8576fb',
          alias: 'jasminetest54bd3a01d68b6a905201c',
          dashboardId: 'jasminetest5d35dfc9e6485f1e00e65b42',
          commentReportId: 'jasminetest4d8e2052d5215',
        } as AccountLite,
        groups: null,
        settings: null
      }
    },
    groupIds: null,
    settings: null,
    culture: null,
    favoriteSetting: null,
  };
  function getMockUserPermission(): Observable<Permission> {
    const permission = {
      canUpdate: false
    } as Permission;

    return new Observable((observer) => observer.next(permission));
  }

  function getMockAdminPermission(): Observable<Permission> {
    const permission = {
      canUpdate: true
    } as Permission;
    return new Observable((observer) => observer.next(permission));

  }

  function getMockFailedPermission() {
    return new Observable((observer) => observer.next());
  }


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MockProvider(CacheService),
      MockProvider(TranslateLoaderService),
      MockProvider(PartialTranslateLoaderService),
      MockProvider(TranslateService),
      MockProvider(AccountUtilityService),
      MockProvider(AppSettingsService),
      MockProvider(LocalStorageService)
      ]
    });
    service = TestBed.inject(UserService);
  });


  describe('initial state', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have method to getCurrentUser', () => {
      expect(service.getCurrentUser).toBeDefined();
      expect(service.getCurrentUser).toEqual(jasmine.any(Function));
    });

    it('should have method to setCurrentUser', () => {
      expect(service.setCurrentUser).toBeDefined();
      expect(service.setCurrentUser).toEqual(jasmine.any(Function));
    });

    it('should have method to getCachedUser', () => {
      expect(service.getCachedUser).toBeDefined();
      expect(service.getCachedUser).toEqual(jasmine.any(Function));
    });

    it('should have method to getAdminUser', () => {
      expect(service.getAdminUser).toBeDefined();
      expect(service.getAdminUser).toEqual(jasmine.any(Function));
    });

    it('should have method to getCachedAdminUser', () => {
      expect(service.getCachedAdminUser).toBeDefined();
      expect(service.getCachedAdminUser).toEqual(jasmine.any(Function));
    });

    it('should have method to setAdminUser', () => {
      expect(service.setAdminUser).toBeDefined();
      expect(service.setAdminUser).toEqual(jasmine.any(Function));
    });

    it('should have method to initService', () => {
      expect(service.initService).toBeDefined();
      expect(service.initService).toEqual(jasmine.any(Function));
    });
  });
  let cacheService: CacheService;
  describe('caching methods', () => {

    beforeEach(() => {
      cacheService = TestBed.inject(CacheService);
      spyOn(cacheService, 'get').and.callFake(() => null);
      spyOn(cacheService, 'set').and.callFake(() => []);
    });

    it('getCachedUser should return value from cache', () => {
      service.getCachedUser();
      expect(cacheService.get).toHaveBeenCalledWith(CacheType.UserMeta, 'current-user');
    });

    it('getCachedAdminUser should return value from cache', () => {
      service.getCachedAdminUser();
      expect(cacheService.get).toHaveBeenCalledWith(CacheType.UserMeta, adminUserCacheKey);
    });

    it('setCurrentUser should set a value in cache', () => {
      service.setCurrentUser(user);
      expect(cacheService.set).toHaveBeenCalledWith(CacheType.UserMeta, userCacheKey, user);
    });

    it('setAdminUser should set a value in cache', () => {
      service.setAdminUser(user);
      expect(cacheService.set).toHaveBeenCalledWith(CacheType.UserMeta, adminUserCacheKey, user);
    });

  });

  describe('Getting the Admin User', () => {
    beforeEach(() => {

    });
    it('should check cache', () => {
      cacheService = TestBed.inject(CacheService);
      // @ts-expect-error
      spyOn(cacheService, 'get').and.callFake(() => user as UserContainer);
      spyOn(cacheService, 'set').and.callFake(() => []);
      service.getAdminUser().subscribe(result => {
        expect(cacheService.get).toHaveBeenCalledWith(CacheType.UserMeta, adminUserCacheKey);
        expect(cacheService.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual(user);
      });
    });
    let permissionService: PermissionService;
    describe('when user permission canUpdate is true', () => {
      beforeEach(() => {
        cacheService = TestBed.inject(CacheService);
        spyOn(cacheService, 'get').and.callFake(() => undefined);
        spyOn(cacheService, 'set').and.callFake(() => []);
        permissionService = TestBed.inject(PermissionService);
        spyOn(permissionService, 'getPermissionsByObjectId').and.callFake(getMockAdminPermission);
      });

      it('should set cache as admin user', () => {
        const mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getAdminUser().subscribe((result: any) => {
          expect(result.isAdmin).toBe(true);
        });
        const httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);

      });

      it('should set user cache', () => {
        const mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getAdminUser().subscribe(result => {
          expect(cacheService.set).toHaveBeenCalledTimes(1);
        });
        const httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);
      });

      it('should load admin template', () => {
        const translateLoaderService = TestBed.inject(TranslateLoaderService);
        spyOn(translateLoaderService, 'loadAdminTemplate').and.callFake(() => undefined);

        const mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getAdminUser().subscribe(result => {
          expect(translateLoaderService.loadAdminTemplate).toHaveBeenCalledTimes(1);
        });
        const httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);
      });

      it('should return current user', () => {
        const mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getAdminUser().subscribe((result: any) => {
          expect(result.isAdmin).toBe(true);
          expect(result.userId).toEqual(33);
          expect(result.email).toEqual(user.email);
        });
        const httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);
      });
    });
    describe('when user permission canUpdate is false', () => {
      beforeEach(() => {
        permissionService = TestBed.inject(PermissionService);
        spyOn(permissionService, 'getPermissionsByObjectId').and.callFake(getMockUserPermission);
      });

      it('should not set cache as admin user', () => {
        const mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getAdminUser().subscribe((result: any) => {
          expect(result.isAdmin).toBe(false);

        });
        const httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);
      });

    });

  });


  describe('Current User', () => {
    const expectedAccount = user.accounts[Object.keys(user.accounts)[0]].account;

    it('should check cache', () => {
      cacheService = TestBed.inject(CacheService);
      // @ts-expect-error
      spyOn(cacheService, 'get').and.callFake(() => user);
      spyOn(cacheService, 'set').and.callFake(() => []);
      service.getCurrentUser().subscribe(result => {
        expect(cacheService.get).toHaveBeenCalledWith(CacheType.UserMeta, userCacheKey);
        expect(cacheService.get).toHaveBeenCalledTimes(1);
      });
    });
    let translate: TranslateService;
    describe('when MENU has been translated', () => {

      beforeEach(() => {
        translate = TestBed.inject(TranslateService);
        spyOn(translate, 'instant').and.callFake(() => 'Translated Menu');
        const translateLoaderService = TestBed.inject(TranslateLoaderService);
        const translations = {};
        spyOn(translateLoaderService, 'loadAccountTemplate').and.callFake(() => new Observable((observer) => observer.next()));
        cacheService = TestBed.inject(CacheService);
        spyOn(cacheService, 'get').and.callFake(() => undefined);
        spyOn(cacheService, 'set').and.callFake(() => []);
      });

      it('should set user cache', () => {
        const mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);

        service.getCurrentUser().subscribe(result => {
          expect(cacheService.set).toHaveBeenCalledTimes(1);
        });
        const httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);
      });

      it('should set selected account', () => {
            const mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
            const accountUtilityService = TestBed.inject(AccountUtilityService);
            spyOn(accountUtilityService, 'setSelectedAccount').and.callFake(() => undefined);
            service.getCurrentUser().subscribe(result => {
              expect(accountUtilityService.setSelectedAccount).toHaveBeenCalledWith(expectedAccount);
              expect(accountUtilityService.setSelectedAccount).toHaveBeenCalledTimes(1);
            });
            const httpRequest = mockHttp.expectOne(url);
            httpRequest.flush(user);
          });

      });

    describe('should reject the response', () => {

          it('when current user requests fails', () => {
            const mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
            const accountUtilityService = TestBed.inject(AccountUtilityService);
            spyOn(accountUtilityService, 'setSelectedAccount').and.callFake(() => undefined);
            const errorMessage = 'Bad Request';
            const errorEvnt = new ErrorEvent(errorMessage);

            service.getCurrentUser().subscribe(result => {
              // we should not enter here.
              expect(1).toBe(0);
            }, (error) => {
              expect(error.status).toBe(500);
              expect(error.statusText).toBe(errorMessage);
            });
            const httpRequest = mockHttp.expectOne(url);
            httpRequest.error(errorEvnt, {status: 500, statusText: errorMessage});
          });

          it('when current user does not have any accounts', () => {
            const userNoAccounts = {
              userId: 33,
              email: 'jasminetest@smg.com',
              settings: []
          };
            const mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
            const accountUtilityService = TestBed.inject(AccountUtilityService);
            spyOn(accountUtilityService, 'setSelectedAccount').and.callFake(() => undefined);
            service.getCurrentUser().subscribe(result => {
              // we should not enter here.
              expect(1).toBe(0);
            }, (error) => {
              expect(error).not.toBe(undefined);
            });
            const httpRequest = mockHttp.expectOne(url);
            httpRequest.flush(userNoAccounts);
          });

          it('when current user does not have an account', () => {
            const userNoAccount = {
              userId: 33,
              email: 'jasminetest@smg.com',
              settings: [],
              accounts: {}
          };
            const mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
            const accountUtilityService = TestBed.inject(AccountUtilityService);
            spyOn(accountUtilityService, 'setSelectedAccount').and.callFake(() => undefined);
            service.getCurrentUser().subscribe(result => {
              // we should not enter here.
              expect(1).toBe(0);
            }, (error) => {
              expect(error).not.toBe(undefined);
            });
            const httpRequest = mockHttp.expectOne(url);
            httpRequest.flush(userNoAccount);

          });
      });

  });

  describe('Init the service', () => {
    let appSettingsService;
    let localStorageService;
    let token;
    beforeEach(() => {
      appSettingsService = TestBed.inject(AppSettingsService);
      spyOn(appSettingsService, 'getSetting').and.returnValue({ internalUser: '1234' });
      localStorageService = TestBed.inject(LocalStorageService);
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZ3JvdXBfaWQiOiIxMjM0In0.cwc6xDHOskYuzBV0QKS1c8Xrpzl-VZr9UOvOFYHXLiQ';
    });
    it('should success when current user is admin', () => {
      spyOn(localStorageService, 'getObjectItem').and.returnValue({ token });
      spyOn(service, 'getAdminUser').and.returnValue(of({ isAdmin: true } as unknown as UserContainer));
      service.initService().subscribe(result => {
        expect(service.isAdmin).toEqual(true);
      });
    });
    it('should success when current user is not a admin', () => {
      spyOn(localStorageService, 'getObjectItem').and.returnValue({ token });
      spyOn(service, 'getAdminUser').and.returnValue(of({ isAdmin: false } as unknown as UserContainer));
      service.initService().subscribe(result => {
        expect(service.isAdmin).toEqual(false);
      });
    });
    it('should success when current user is a internal user', () => {
      spyOn(localStorageService, 'getObjectItem').and.returnValue({ token });
      spyOn(service, 'getAdminUser').and.returnValue(of({ isAdmin: false } as unknown as UserContainer));
      service.initService().subscribe(result => {
        expect(service.isInternalUser).toEqual(true);
      });
    });
    it('should success when current user is not a internal user', () => {
      spyOn(service, 'getAdminUser').and.returnValue(of({ isAdmin: false } as unknown as UserContainer));
      // this token has group_id = 1235;
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZ3JvdXBfaWQiOiIxMjM1In0.qb_6RtTWbjT-eTaLZiGRjX6ZgTYJYrSVDziYFsLN2aI';
      spyOn(localStorageService, 'getObjectItem').and.returnValue({ token });
      service.initService().subscribe(result => {
        expect(service.isInternalUser).toEqual(false);
      });
    });
  });
});
