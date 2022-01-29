import { CreateUserEntity } from './create-user-entity.model';

export interface CreateUserRequest {
  sourceSystemId: number;
  sourceIds: string[];
  users: CreateUserEntity[];
}
