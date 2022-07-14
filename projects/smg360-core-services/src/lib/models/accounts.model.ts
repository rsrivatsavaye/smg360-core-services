import { Account } from './account.model';

export class Accounts {
  accounts: Array<Account>;
  constructor() {
    this.accounts = [];
  }

  static create() {
    return new Accounts();
  }

  push(account) {
    this.accounts.push(account);
  }

  add(id, name, type, isActive, classification) {
    this.accounts.push(new Account(id, name, type, isActive, classification));
  }

  find(account) {
    return this.accounts.filter(item => {
      return account.id === item.id;
    });
  }

  getAccountName(accountId) {
    const matchingAccounts = this.accounts.filter(account => {
      return account.id === accountId;
    });

    if (matchingAccounts.length === 0) {
      return null;
    }

    return matchingAccounts[0].name;
  }

  getAccountsWithMatchingNames(name) {
    const matchingAccounts = new Accounts();
    // TODO: change this to a filter??
    this.accounts.forEach(account => {
      if (account.name.toUpperCase().indexOf(name.toUpperCase()) === 0) {
        matchingAccounts.accounts.push(account);
      }
    });

    return matchingAccounts;
  }

  accountIdExists(accountId) {
    return (
      this.accounts.filter(account => {
        return account.id === accountId;
      }).length > 0
    );
  }

  setFavorites(favoriteIds) {
    if (!Array.isArray(favoriteIds)) {
      return;
    }

    for (let i = 0, len = this.accounts.length; i < len; i++) {
      const currentAccount = this.accounts[i];
      currentAccount.isFavorite = false;

      for (let j = 0, cnt = favoriteIds.length; j < cnt; j++) {
        const currentFavoriteId = favoriteIds[j];
        if (currentAccount.id === currentFavoriteId) {
          currentAccount.isFavorite = true;
          break;
        }
      }
    }
  }
}
