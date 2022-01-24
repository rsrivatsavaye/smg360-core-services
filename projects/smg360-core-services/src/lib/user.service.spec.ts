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

describe('UserService', () => {
  let service: UserService;
  const url = '/api/user/current';
  const mockLanguage = 'en-GB';
  const userCacheKey = 'current-user';
  const adminUserCacheKey = 'current-admin-user';
  const user = {
    "userId": 33,
    "email": 'jasminetest@smg.com',
    "accounts": {
      "jasminetest36f280f8576fb": {
        "account": {
          "id": 'jasminetest36f280f8576fb',
          "alias": 'jasminetest54bd3a01d68b6a905201c',
          "dashboardId": "jasminetest5d35dfc9e6485f1e00e65b42",
          "commentReportId": 'jasminetest4d8e2052d5215'
        },
        "groups": null,
        "settings": null
      }
    }
  };
  function getMockUserPermission() {
    const permission = {
      canUpdate: false
    };

    return new Observable((observer) => observer.next(permission));
  }

  function getMockAdminPermission() {
    const permission = {
      canUpdate: true
    };
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


  describe('initial state', function () {
    it('should be defined', function () {
      expect(service).toBeDefined();
    });

    it('should have method to getCurrentUser', function () {
      expect(service.getCurrentUser).toBeDefined();
      expect(service.getCurrentUser).toEqual(jasmine.any(Function));
    });

    it('should have method to setCurrentUser', function () {
      expect(service.setCurrentUser).toBeDefined();
      expect(service.setCurrentUser).toEqual(jasmine.any(Function));
    });

    it('should have method to getCachedUser', function () {
      expect(service.getCachedUser).toBeDefined();
      expect(service.getCachedUser).toEqual(jasmine.any(Function));
    });

    it('should have method to getAdminUser', function () {
      expect(service.getAdminUser).toBeDefined();
      expect(service.getAdminUser).toEqual(jasmine.any(Function));
    });

    it('should have method to getCachedAdminUser', function () {
      expect(service.getCachedAdminUser).toBeDefined();
      expect(service.getCachedAdminUser).toEqual(jasmine.any(Function));
    });

    it('should have method to setAdminUser', function () {
      expect(service.setAdminUser).toBeDefined();
      expect(service.setAdminUser).toEqual(jasmine.any(Function));
    });

    it('should have method to initService', function () {
      expect(service.initService).toBeDefined();
      expect(service.initService).toEqual(jasmine.any(Function));
    });
  });
  var cacheService: CacheService;
  describe('caching methods', function () {

    beforeEach(() => {
      cacheService = TestBed.inject(CacheService);
      spyOn(cacheService, "get").and.callFake(() => { });
      spyOn(cacheService, "set").and.callFake(() => []);
    });

    it('getCachedUser should return value from cache', function () {
      service.getCachedUser();
      expect(cacheService.get).toHaveBeenCalledWith(CacheType.UserMeta, 'current-user');
    });

    it('getCachedAdminUser should return value from cache', function () {
      service.getCachedAdminUser();
      expect(cacheService.get).toHaveBeenCalledWith(CacheType.UserMeta, adminUserCacheKey);
    });

    it('setCurrentUser should set a value in cache', function () {
      service.setCurrentUser(user);
      expect(cacheService.set).toHaveBeenCalledWith(CacheType.UserMeta, userCacheKey, user);
    });

    it('setAdminUser should set a value in cache', function () {
      service.setAdminUser(user);
      expect(cacheService.set).toHaveBeenCalledWith(CacheType.UserMeta, adminUserCacheKey, user);
    });

  });

  describe('Getting the Admin User', function () {
    beforeEach(() => {

    });
    it('should check cache', function () {
      cacheService = TestBed.inject(CacheService);
      spyOn(cacheService, "get").and.callFake(() => user);
      spyOn(cacheService, "set").and.callFake(() => []);
      service.getAdminUser().subscribe(result => {
        expect(cacheService.get).toHaveBeenCalledWith(CacheType.UserMeta, adminUserCacheKey);
        expect(cacheService.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual(user);
      });
    });
    var permissionService: PermissionService;
    describe('when user permission canUpdate is true', function () {
      beforeEach(function () {
        cacheService = TestBed.inject(CacheService);
        spyOn(cacheService, "get").and.callFake(() => undefined);
        spyOn(cacheService, "set").and.callFake(() => []);
        permissionService = TestBed.inject(PermissionService);
        spyOn(permissionService, "getPermissionsByObjectId").and.callFake(getMockAdminPermission)
      });

      it('should set cache as admin user', function () {
        var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getAdminUser().subscribe((result: any) => {
          expect(result.isAdmin).toBe(true);
        });
        var httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);

      });

      it('should set user cache', function () {
        var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getAdminUser().subscribe(result => {
          expect(cacheService.set).toHaveBeenCalledTimes(1);
        });
        var httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);
      });

      it('should load admin template', function () {
        var translateLoaderService = TestBed.inject(TranslateLoaderService);
        spyOn(translateLoaderService, "loadAdminTemplate").and.callFake(() => undefined);

        var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getAdminUser().subscribe(result => {
          expect(translateLoaderService.loadAdminTemplate).toHaveBeenCalledTimes(1);
        });
        var httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);
      });

      it('should return current user', function () {
        var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getAdminUser().subscribe((result: any) => {
          expect(result.isAdmin).toBe(true);
          expect(result.userId).toEqual(33);
          expect(result.email).toEqual(user.email);
        });
        var httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);
      });
    });
    describe('when user permission canUpdate is false', function () {
      beforeEach(function () {
        permissionService = TestBed.inject(PermissionService);
        spyOn(permissionService, "getPermissionsByObjectId").and.callFake(getMockUserPermission)
      });

      it('should not set cache as admin user', function () {
        var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getAdminUser().subscribe((result: any) => {
          expect(result.isAdmin).toBe(false);

        });
        var httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);
      });

    });

  });


  describe('Current User', function () {
    const expectedAccount = user.accounts[Object.keys(user.accounts)[0]].account;

    it('should check cache', function () {
      cacheService = TestBed.inject(CacheService);
      spyOn(cacheService, "get").and.callFake(() => user);
      spyOn(cacheService, "set").and.callFake(() => []);
      service.getCurrentUser().subscribe(result=>{
        expect(cacheService.get).toHaveBeenCalledWith(CacheType.UserMeta, userCacheKey);
        expect(cacheService.get).toHaveBeenCalledTimes(1);
      });
    });
    var translate: TranslateService;
    describe('when MENU has been translated', function () {

      beforeEach(function () {
        translate = TestBed.inject(TranslateService);
        spyOn(translate, "instant").and.callFake(() => 'Translated Menu');
        var translateLoaderService = TestBed.inject(TranslateLoaderService);
        const translations={};
        spyOn(translateLoaderService, "loadAccountTemplate").and.callFake(() => new Observable((observer) => observer.next()));
        cacheService = TestBed.inject(CacheService);
        spyOn(cacheService, "get").and.callFake(() => undefined);
        spyOn(cacheService, "set").and.callFake(() => []);
      });

      it('should set user cache', function () {
        var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);

        service.getCurrentUser().subscribe(result=>{
          expect(cacheService.set).toHaveBeenCalledTimes(1);
        });
        var httpRequest = mockHttp.expectOne(url);
        httpRequest.flush(user);
      });

          it('should set selected account', function () {
            var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
            var accountUtilityService = TestBed.inject(AccountUtilityService);
            spyOn(accountUtilityService, "setSelectedAccount").and.callFake(() => undefined);
            service.getCurrentUser().subscribe(result=>{
              expect(accountUtilityService.setSelectedAccount).toHaveBeenCalledWith(expectedAccount);
              expect(accountUtilityService.setSelectedAccount).toHaveBeenCalledTimes(1);
            });
            var httpRequest = mockHttp.expectOne(url);
            httpRequest.flush(user);
          });

      });

      describe('should reject the response', function () {

          it('when current user requests fails', function () {
            var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
            var accountUtilityService = TestBed.inject(AccountUtilityService);
            spyOn(accountUtilityService, "setSelectedAccount").and.callFake(() => undefined);
            const errorMessage = 'Bad Request';
            var errorEvnt = new ErrorEvent(errorMessage)

            service.getCurrentUser().subscribe(result=>{
              // we should not enter here.
              expect(1).toBe(0);
            },(error)=>{
              expect(error.status).toBe(500);
              expect(error.statusText).toBe(errorMessage);
            });
            var httpRequest = mockHttp.expectOne(url);
            httpRequest.error(errorEvnt,{status:500,statusText:errorMessage});
          });

          it('when current user does not have any accounts', function () {
            const userNoAccounts = {
              "userId": 33,
              "email": 'jasminetest@smg.com',
              "settings": []
          };
            var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
            var accountUtilityService = TestBed.inject(AccountUtilityService);
            spyOn(accountUtilityService, "setSelectedAccount").and.callFake(() => undefined);
            service.getCurrentUser().subscribe(result=>{
              // we should not enter here.
              expect(1).toBe(0);
            },(error)=>{
              expect(error).not.toBe(undefined);
            });
            var httpRequest = mockHttp.expectOne(url);
            httpRequest.flush(userNoAccounts);
          });

          it('when current user does not have an account', function () {
            const userNoAccount = {
              "userId": 33,
              "email": 'jasminetest@smg.com',
              "settings": [],
              "accounts": {}
          };
            var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
            var accountUtilityService = TestBed.inject(AccountUtilityService);
            spyOn(accountUtilityService, "setSelectedAccount").and.callFake(() => undefined);
            service.getCurrentUser().subscribe(result=>{
              // we should not enter here.
              expect(1).toBe(0);
            },(error)=>{
              expect(error).not.toBe(undefined);
            });
            var httpRequest = mockHttp.expectOne(url);
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
      spyOn(service, 'getAdminUser').and.returnValue(of({ isAdmin: true }));
      service.initService().subscribe(result => {
        expect(service.isAdmin).toEqual(true);
      });
    });
    it('should success when current user is not a admin', () => {
      spyOn(localStorageService, 'getObjectItem').and.returnValue({ token });
      spyOn(service, 'getAdminUser').and.returnValue(of({ isAdmin: false }));
      service.initService().subscribe(result => {
        expect(service.isAdmin).toEqual(false);
      });
    });
    it('should success when current user is a internal user', () => {
      spyOn(localStorageService, 'getObjectItem').and.returnValue({ token });
      spyOn(service, 'getAdminUser').and.returnValue(of({ isAdmin: false }));
      service.initService().subscribe(result => {
        expect(service.isInternalUser).toEqual(true);
      });
    });
    it('should success when current user is not a internal user', () => {
      spyOn(service, 'getAdminUser').and.returnValue(of({ isAdmin: false }));
      // this token has group_id = 1235;
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZ3JvdXBfaWQiOiIxMjM1In0.qb_6RtTWbjT-eTaLZiGRjX6ZgTYJYrSVDziYFsLN2aI';
      spyOn(localStorageService, 'getObjectItem').and.returnValue({ token });
      service.initService().subscribe(result => {
        expect(service.isInternalUser).toEqual(false);
      });
    });
  });
});
