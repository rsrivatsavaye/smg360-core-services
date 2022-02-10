import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { CacheType } from './enums/cacheType.enum';
import { EntityType } from './enums/entity-type.enum';
import { Permission } from './models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  BaseUrl = '';
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

    return this.http.get<Array<Permission>>(this.BaseUrl + `/api/permission?entityType=${entityType}`)
      .pipe(map((permissions: Array<Permission>) => {
      this.cacheService.set(CacheType.Permissions, entityType, permissions);
      return permissions;
    }));
  }

  getPermissionsByObjectId(entityType: EntityType, objectId: string | number): Observable<Permission> {
    return this.getPermissions(entityType, true).pipe(map((permissions: Array<Permission>) => {
      const foundEntityPermissions = [];
      const foundObjectPermissions = [];

      for (const permissionIndex in permissions) {
        if (permissions.hasOwnProperty(permissionIndex)) {
          const permission = permissions[permissionIndex];

          if (objectId === permission.entityId && entityType === permission.entityType) {
            foundObjectPermissions.push(permission);
          } else if ((permission.entityId == null || permission.entityId === '') && entityType === permission.entityType) {
            foundEntityPermissions.push(permission);
          }
        }
      }

      if (foundObjectPermissions.length) {
        return this.combinePermissions(foundObjectPermissions);
      } else if (foundEntityPermissions.length) {
        return this.combinePermissions(foundEntityPermissions);
      } else {
        return {
          canCreate: false,
          canRead: false,
          canUpdate: false,
          canDelete: false
        } as Permission;
      }
    }));
  }

  private combinePermissions(permissions: Array<Permission>): Permission {
    let canCreate = false;
    let canRead = false;
    let canUpdate = false;
    let canDelete = false;
    permissions.forEach(permission => {
      canCreate = canCreate || permission.canCreate;
      canRead = canRead || permission.canRead;
      canUpdate = canUpdate || permission.canUpdate;
      canDelete = canDelete || permission.canDelete;
    });
    return {
      ...permissions[0],
      ...{
        canCreate,
        canDelete,
        canRead,
        canUpdate
      }
    };
  }
}
