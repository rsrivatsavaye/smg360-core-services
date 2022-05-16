import { AccountLite } from './account-lite';

export interface AccountContainer {
  account: AccountLite;
  groups: number[];
  settings: { [key: string]: unknown };
}
