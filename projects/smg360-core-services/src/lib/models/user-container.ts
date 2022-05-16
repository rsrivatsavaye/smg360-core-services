import { AccountContainer } from './account-container';
import { FavoriteSetting } from './favorite-setting';

export interface UserContainer {
  userId: number;
  email: string;
  groupIds: number[];

  settings: { [key: string]: unknown };

  accounts: {[key: string]: AccountContainer };

  culture: string; // TODO figure out why this is a string when BE model has CultureInfo

  favoriteSetting: FavoriteSetting;

  [key: string]: unknown;
}
