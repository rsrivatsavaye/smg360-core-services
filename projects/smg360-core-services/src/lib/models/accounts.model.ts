import { Account } from './account.model';

export class Accounts {
    accounts: Array<Account>;
    constructor() {
        this.accounts = [];
    }

    static create = function () {
        return new Accounts();
    };

    push = function (account) {
        this.accounts.push(account);
    };

    add = function (id, name, type, isActive, classification) {
        this.accounts.push(new Account(id, name, type, isActive, classification));
    };

    find = function (account) {
        return this.accounts.filter(function (item) {
            return account.id === item.id;
        });
    };

    getAccountName = function (accountId) {
        const matchingAccounts = this.accounts.filter(function (account) {
            return account.id === accountId;
        });

        if (matchingAccounts.length === 0)
            return null;

        return matchingAccounts[0].name;
    };

    getAccountsWithMatchingNames = function (name) {
        var matchingAccounts = new Accounts();
        //TODO: change this to a filter??
        this.accounts.forEach(
            (account) => {
                if (account.name.toUpperCase().indexOf(name.toUpperCase()) === 0) {
                    matchingAccounts.accounts.push(account);
                }
            });

        return matchingAccounts;
    };

    accountIdExists = function (accountId) {
        return this.accounts.filter(function (account) {
            return account.id === accountId;
        }).length >
            0;
    };

    setFavorites = function (favoriteIds) {
        if (!Array.isArray(favoriteIds)) return;

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
    };
}
