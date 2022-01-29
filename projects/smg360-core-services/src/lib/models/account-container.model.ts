import { SettingsContainer } from './settings-container.model';
import { Grouped } from './grouped.model';
import { AccountLite } from './account-lite.model';

export interface AccountContainer extends SettingsContainer, Grouped {
  account: AccountLite;
}
