import { BaseUser } from './base-user.model';

export interface UserDetails extends BaseUser {
  emailAddresses: string[];
}
