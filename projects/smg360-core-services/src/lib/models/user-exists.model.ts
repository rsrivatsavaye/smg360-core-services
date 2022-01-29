import { BaseUser } from './base-user.model';

export interface UserExists extends BaseUser {
  exists: boolean;
}
