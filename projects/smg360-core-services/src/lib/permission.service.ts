import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { CacheType } from './enums/cacheType.enum';
import { EntityType } from './enums/entity-type.enum';
import { Permission } from './models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  BaseUrl: string = "";
  constructor(private http: HttpClient, private cacheService: CacheService) { }

  getGroupPermissions(groupId: string | number) {
    return this.http.get(this.BaseUrl + `/api/permission?groupId=${groupId}`);
  }

  getPermissions(entityType: EntityType, useCache: boolean) {

    if (useCache) {
      const cachedPermissions: Array<Permission> = this.cacheService.get(CacheType.Permissions, entityType) || [];
      if (cachedPermissions.length !== 0) {
        return new Observable((observer) => observer.next(cachedPermissions));
      }
    }

    return this.http.get<Array<Permission>>(this.BaseUrl + `/api/permission?entityType=${entityType}`).pipe(map((permissions: Array<Permission>) => {
      this.cacheService.set(CacheType.Permissions, entityType, permissions);
      return permissions;
    }));
  }

  getPermissionsByObjectId(entityType: EntityType, objectId: string | number) {
    return this.getPermissions(entityType, true).pipe(map((permissions: Array<Permission>) => {
      var foundEntityPermission;
      var foundObjectPermission;

      for (let permissionIndex in permissions) {
        if (permissions.hasOwnProperty(permissionIndex)) {
          const permission = permissions[permissionIndex];

          if (objectId === permission.entityId && entityType === permission.entityType) {
            foundObjectPermission = permission;
          } else if ((permission.entityId == null || permission.entityId === "") && entityType === permission.entityType) {
            foundEntityPermission = permission;
          }
        }
      }

      if (foundObjectPermission) {
        return foundObjectPermission;
      } else if (foundEntityPermission) {
        return foundEntityPermission;
      } else {
        return {
          canCreate: false,
          canRead: false,
          canUpdate: false,
          canDelete: false
        };
      }
    }));
  }
}
