import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';
import { EntityType } from './enums/entity-type.enum';

import { PermissionService } from './permission.service';
import { Permission } from "./models/permission.model";

describe('PermissionService', () => {
  let service: PermissionService;
  const groupId = "14987";
  const entityType = EntityType.Account;
  const moqCacheData = [
    {
      id: 7894,
      entityType: EntityType.Account,
      entityId: "5898d776e0136f280f8576fb",
      canCreate: false,
      canRead: true,
      canUpdate: true,
      canDelete: false
    },
    {
      id: 5923,
      entityType: EntityType.Account,
      entityId: "2452b52345323523vf5vg365",
      canCreate: true,
      canRead: true,
      canUpdate: false,
      canDelete: false
    }
  ];
  const moqData = [
    {
      id: 2133,
      entityType: EntityType.Account,
      entityId: "5898d776e0136f280f8576fb",
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false
    },
    {
      id: 3331,
      entityType: EntityType.Account,
      entityId: "",
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true
    }
  ];

  let useCache = false;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  describe("Initial State", function () {
    it("should define the service", function () {
      expect(service).toBeDefined();
    });

    it("should define getPermissions method", function () {
      expect(service.getPermissions).toBeDefined();
      expect(service.getPermissions).toEqual(jasmine.any(Function));
    });

    it("should define getGroupPermissions method", function () {
      expect(service.getGroupPermissions).toBeDefined();
      expect(service.getGroupPermissions).toEqual(
        jasmine.any(Function)
      );
    });

    it("should define getPermissionsByObjectId method", function () {
      expect(service.getPermissionsByObjectId).toBeDefined();
      expect(service.getPermissionsByObjectId).toEqual(
        jasmine.any(Function)
      );
    });
  });

  describe("Group Permissions", function () {
    it("should make a request", function () {
      const url = "/api/permission?groupId=14987";
      var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);

      service.getGroupPermissions(groupId).subscribe(permissions => {
        expect(permissions).toBe(moqData);
      });
      var req = mockHttp.expectOne(service.BaseUrl + url);
      req.flush(moqData);
    });
  });

  describe("Permissions", function () {
    const url = "/api/permission?entityType=6";

    it("should make a request", function () {

      var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
      var cacheService: CacheService = TestBed.inject(CacheService);
      spyOn(cacheService, "get").and.callFake(() => undefined);
      spyOn(cacheService, "set").and.callFake(() => []);
      service.getPermissions(entityType, useCache).subscribe(permissions => {
        expect(permissions).toBe(moqData);
        expect(cacheService.set).toHaveBeenCalledTimes(1);
      });
      var req = mockHttp.expectOne(service.BaseUrl + url);
      req.flush(moqData);
    });

    it('should retrieve from cache when cache is available and useCache flag is true', function () {
      useCache = true;
      var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
      var cacheService: CacheService = TestBed.inject(CacheService);
      spyOn(cacheService, "get").and.callFake(() => moqCacheData);
      spyOn(cacheService, "set").and.callFake(() => []);
      service.getPermissions(entityType, useCache).subscribe(permissions => {
        expect(permissions).toBe(moqCacheData);
        expect(cacheService.get).toHaveBeenCalledTimes(1);
        expect(cacheService.set).toHaveBeenCalledTimes(0);
      });
      mockHttp.expectNone(service.BaseUrl + url);
    });

    it("should make a request when no cache and useCache flag is true", function () {
      useCache = true;
      var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
      var cacheService: CacheService = TestBed.inject(CacheService);
      spyOn(cacheService, "get").and.callFake(() => undefined);
      spyOn(cacheService, "set").and.callFake(() => []);
      service.getPermissions(entityType, useCache).subscribe(permissions => {
        expect(permissions).toBe(moqData);
        expect(cacheService.get).toHaveBeenCalledTimes(1);
        expect(cacheService.set).toHaveBeenCalledTimes(1);
      });
      var req = mockHttp.expectOne(service.BaseUrl + url);
      req.flush(moqData);
    });
  });

  describe("PermissionsByObjectId", function () {
    const url = "/api/permission?entityType=6";

    it("should return permission for matching objectId", function () {
      var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
      var cacheService: CacheService = TestBed.inject(CacheService);
      spyOn(cacheService, "get").and.callFake(() => undefined);
      spyOn(cacheService, "set").and.callFake(() => []);
      const objectId = "5898d776e0136f280f8576fb";
      var selected = moqData.filter(
        x => x.entityId === objectId && x.entityType === entityType
      )[0];
      service.getPermissionsByObjectId(entityType, objectId).subscribe(permission => {
        expect(cacheService.set).toHaveBeenCalledTimes(1);
        expect(permission).toEqual(selected);
      });
      var httpRequest = mockHttp.expectOne(service.BaseUrl + url);
      httpRequest.flush(moqData);
    });

    it("should return permission for entity, when objectId is null", function () {

      var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
      var cacheService: CacheService = TestBed.inject(CacheService);
      spyOn(cacheService, "get").and.callFake(() => undefined);
      spyOn(cacheService, "set").and.callFake(() => []);
      const objectId = null;
      var selected = moqData.filter(x => x.entityId === "" && x.entityType === entityType)[0]
      service.getPermissionsByObjectId(entityType, objectId).subscribe(permission => {
        expect(cacheService.set).toHaveBeenCalledTimes(1);
        expect(permission).toEqual(selected);
      });
      var httpRequest = mockHttp.expectOne(service.BaseUrl + url);
      httpRequest.flush(moqData);

    });

    it("should return permission for entity, when objectId is empty string", function () {
      var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
      var cacheService: CacheService = TestBed.inject(CacheService);
      spyOn(cacheService, "get").and.callFake(() => undefined);
      spyOn(cacheService, "set").and.callFake(() => []);
      const objectId = '';
      var selected = moqData.filter(x => x.entityId === "" && x.entityType === entityType)[0]
      service.getPermissionsByObjectId(entityType, objectId).subscribe(permission => {
        expect(cacheService.set).toHaveBeenCalledTimes(1);
        expect(permission).toEqual(selected);
      });
      var httpRequest = mockHttp.expectOne(service.BaseUrl + url);
      httpRequest.flush(moqData);
    });

    it("should return no permissions when objectId is not found", function () {
      var mockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
      var cacheService: CacheService = TestBed.inject(CacheService);
      spyOn(cacheService, "get").and.callFake(() => undefined);
      spyOn(cacheService, "set").and.callFake(() => []);
      const objectId = 'NotFoundObjectId';
      var selected = moqData.filter(x => x.entityId === "" && x.entityType === entityType)[0]
      service.getPermissionsByObjectId(entityType, objectId).subscribe(permission => {
        expect(cacheService.set).toHaveBeenCalledTimes(1);
        expect(permission).toBe({
          canCreate: false,
          canRead: false,
          canUpdate: false,
          canDelete: false
        } as Permission);
      });
    });
  });


});
