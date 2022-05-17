import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockProvider } from 'ng-mocks';
import { AccountService } from './account.service';
import { CacheService } from './cache.service';
import { Accounts } from './models/accounts.model';
import { Account } from './models/account.model';
import { CacheType } from './enums/cacheType.enum';

describe('AccountService', () => {
  let service: AccountService;

  const cacheType = CacheType.Account;
  const allAccountsCacheKey = 'all-accounts';
  const mockAllAccounts: Array<Account> = [
    { id: '1', nameKey: 'name 1', isActive: true, classification: 0 } as Account,
    { id: '2', nameKey: 'name 2', isActive: true, classification: 0  } as Account,
    { id: '3', nameKey: 'name 3', isActive: true, classification: 0  } as Account
  ];
  function getAccountsModel() {

    const allAccounts = new Accounts();

    mockAllAccounts.forEach(account => {
      allAccounts.add(account.id, account.nameKey, undefined, account.isActive, account.classification);
    });

    return allAccounts;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MockProvider(CacheService)]
    });
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should define a method to get list of accounts', () => {
      expect(service.getListing).toBeDefined();
      expect(service.getListing).toEqual(jasmine.any(Function));
    });

    it('should define a method to get a specific account', () => {
      expect(service.get).toBeDefined();
      expect(service.get).toEqual(jasmine.any(Function));
    });

    it('should define a method to save and account', () => {
      expect(service.save).toBeDefined();
      expect(service.save).toEqual(jasmine.any(Function));
    });

    it('should define a method to invalidate cache', () => {
      expect(service.invalidateCache).toBeDefined();
      expect(service.invalidateCache).toEqual(jasmine.any(Function));
    });

  });


  describe(':: API calls', () => {
    let mockHttp: HttpTestingController;
    beforeEach(() => {
      mockHttp = TestBed.inject(HttpTestingController);
    });
    describe(':: getListing', () => {


      it('should make a request when not in cache', () => {
        const cacheService: CacheService = TestBed.inject(CacheService);
        spyOn(cacheService, 'get').and.callFake(() => undefined);
        spyOn(cacheService, 'set').and.callFake(() => []);
        const innerMockHttp: HttpTestingController = TestBed.inject(HttpTestingController);
        service.getListing().subscribe((result) => {
          expect(httpRequest.request.method).toEqual('GET');
          expect(cacheService.get).toHaveBeenCalledTimes(1);
          expect(cacheService.set).toHaveBeenCalledTimes(1);
        });
        const httpRequest = innerMockHttp.expectOne(service.BaseUrl + '/api/account/listing');
        httpRequest.flush([]);
      });

      it('should not make request when cache in cache', () => {
        const cacheService: CacheService = TestBed.inject(CacheService);
        spyOn(cacheService, 'get').and.callFake(() => getAccountsModel());
        spyOn(cacheService, 'set').and.callFake(() => []);

        service.getListing().subscribe((response) => {
          expect(cacheService.get).toHaveBeenCalledWith(cacheType, allAccountsCacheKey);
          expect(cacheService.set).not.toHaveBeenCalled();
          expect(JSON.stringify(response)).toEqual(JSON.stringify(getAccountsModel()));
        });

        mockHttp.expectNone(service.BaseUrl + '/api/account/listing');

      });
    });

    describe(':: get', () => {

      it('should make a request when not in cache', () => {

        const cacheService: CacheService = TestBed.inject(CacheService);
        spyOn(cacheService, 'get').and.callFake(() => undefined);
        spyOn(cacheService, 'set').and.callFake(() => []);
        service.get(mockAllAccounts[0].id).subscribe((result) => {
          expect(cacheService.get).toHaveBeenCalledWith(cacheType, mockAllAccounts[0].id);
          expect(cacheService.set).toHaveBeenCalledWith(cacheType, mockAllAccounts[0].id, result);
        });
        const response = mockHttp.expectOne('/api/account/' + mockAllAccounts[0].id);
        response.flush(mockAllAccounts[0]);

      });

      it('should not make request when cached', () => {
        const cacheService: CacheService = TestBed.inject(CacheService);
        spyOn(cacheService, 'get').and.callFake(() => mockAllAccounts[0]);
        spyOn(cacheService, 'set').and.callFake(() => []);

        service.get(mockAllAccounts[0].id).subscribe((result) => {
          expect(cacheService.get).toHaveBeenCalledWith(cacheType, mockAllAccounts[0].id);
          expect(cacheService.set).not.toHaveBeenCalled();
          expect(JSON.stringify(result)).toEqual(JSON.stringify(mockAllAccounts[0]));
        });
        mockHttp.expectNone('/api/account/' + mockAllAccounts[0].id);
      });
    });

    describe(':: save', () => {

      it('should make a request', () => {
        service.save(mockAllAccounts[0]).subscribe(results => {
          expect(results).toBe(mockAllAccounts[0]);
        });
        const response = mockHttp.expectOne('/api/account/save');
        response.flush(mockAllAccounts[0]);
      });
    });


    describe(':: invalidateCache', () => {
      it('should clear account cache', () => {
        const cacheService: CacheService = TestBed.inject(CacheService);
        spyOn(cacheService, 'clear').and.callFake((_cacheType) => { });
        service.invalidateCache();

        expect(cacheService.clear).toHaveBeenCalledWith(cacheType);
      });

    });

  });

});
