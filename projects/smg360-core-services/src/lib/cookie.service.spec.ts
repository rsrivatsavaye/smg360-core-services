import { TestBed } from '@angular/core/testing';
import { CookieService } from './cookie.service';
import { MockProvider } from 'ng-mocks';
import { CookieOptions, CookieService as CookieSvc } from 'ngx-cookie-service';

describe('CookieService', () => {
  let service: CookieService;
  let cookieSvc: CookieSvc;
  const cookies = { foo: 'bar', Hello: 'World' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(CookieSvc),
      ]
    });
    service = TestBed.inject(CookieService);
    cookieSvc = TestBed.inject(CookieSvc);

    spyOn(cookieSvc, 'deleteAll').and.callFake(() => { });
    spyOn(cookieSvc, 'delete').and.callFake(() => { });
    spyOn(cookieSvc, 'getAll').and.callFake(() => { return cookies });
    spyOn(cookieSvc, 'get').and.callFake(() => { return 'testCookieData' });
    spyOn(cookieSvc, 'set').and.callFake(() => { });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete all cookies', () => {
    service.deleteAllCookies();
    expect(cookieSvc.deleteAll).toHaveBeenCalled();
  });

  it('should delete a cookie', () => {
    service.deleteCookie('testCookie');
    expect(cookieSvc.delete).toHaveBeenCalledWith('testCookie');
  });

  it('should get all cookies', () => {
    const result = service.getAllCookies();
    expect(cookieSvc.getAll).toHaveBeenCalled();
    expect(result).toEqual(cookies);
  });

  it('should get a cookie', () => {
    const result = service.getCookie('testCookie');
    expect(cookieSvc.get).toHaveBeenCalledWith('testCookie');
    expect(result).toEqual('testCookieData');
  });

  it('should set a cookie', () => {
    service.setCookie('cookieName', 'cookieValue');
    expect(cookieSvc.set).toHaveBeenCalledWith('cookieName', 'cookieValue', undefined);
  });
});
