import { SettingsContainer } from './settings-container.model';
import { AccountContainer } from './account-container.model';
import { Grouped } from './grouped.model';

export interface UserContainer extends SettingsContainer, Grouped  {
  userId: number;
  email: string;
  accounts: { [key: string]: AccountContainer };

  // front-end only property:
  isAdmin: boolean;
}
