import { Account } from './account.model';
import { Accounts } from './accounts.model';

describe('AccountsModel', () => {
  beforeEach(() => {});

  it('should be created', () => {
    const accounts = new Accounts();
    expect(accounts).toBeTruthy();
  });

  it('should push an account', () => {
    const account = new Account('a', 'b', 'c', true, 'd');
    const accounts = new Accounts();
    accounts.push(account);
    const foundAccount = accounts.find({ id: 'a' });
    expect(account).toBe(foundAccount[0]);
    expect(foundAccount.length).toEqual(1);
  });

  it('should add an account', () => {
    const accounts = new Accounts();
    accounts.add('a', 'b', 'c', true, 'd');
    const foundAccounts = accounts.find({ id: 'a' });
    const foundAccount = foundAccounts[0];
    expect(foundAccount.id).toEqual('a');
    expect(foundAccount.name).toEqual('b');
    expect(foundAccount.type).toEqual('c');
    expect(foundAccount.isActive).toBeTrue();
    expect(foundAccount.classification).toEqual('d');
    expect(foundAccounts.length).toEqual(1);
  });

  it('should getAccountsWithMatchingNames', () => {
    const accounts = new Accounts();
    accounts.add('a', 'b', 'c', true, 'd');
    accounts.add('aa', 'bb', 'cc', true, 'dd');
    const foundAccounts = accounts.getAccountsWithMatchingNames('BB');
    expect(foundAccounts.accounts.length).toEqual(1);
    expect(foundAccounts.accounts[0].id).toEqual('aa');
  });

  it('should check accountIdExists', () => {
    const accounts = new Accounts();
    accounts.add('a', 'b', 'c', true, 'd');
    accounts.add('aa', 'bb', 'cc', true, 'dd');
    const result = accounts.accountIdExists('aa');
    expect(result).toBeTrue();
    const result2 = accounts.accountIdExists('xx');
    expect(result2).toBeFalse();
  });

  it('should setFavortes', () => {
    const accounts = new Accounts();
    accounts.add('a', 'b', 'c', true, 'd');
    accounts.add('aa', 'bb', 'cc', true, 'dd');
    accounts.setFavorites(['a', 'aa']);
    expect(accounts.accounts[0].isFavorite).toBeTrue();
    expect(accounts.accounts[1].isFavorite).toBeTrue();
  });
});
