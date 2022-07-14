import { EntityType } from '../enums/entity-type.enum';

export class Permission {
    id: string | number;
    entityType: EntityType;
    entityId: string | number;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}
