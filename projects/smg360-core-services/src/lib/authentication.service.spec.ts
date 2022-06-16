import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { AuthenticationService } from './authentication.service';
import { CacheService } from './cache.service';
import { CookieService } from './cookie.service';
import { Views } from './enums/views.enum';
import { LocationService } from './location.service';
import { V5AuthenticationRefreshService } from './v5-authentication-refresh.service';
import { ViewService } from './view.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MockProvider(CacheService),
      MockProvider(ViewService),
      MockProvider(Router),
      MockProvider(V5AuthenticationRefreshService)
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("initial state", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
    });

    it("should define a method logOut", () => {
      expect(service.logOut).toBeDefined();
      expect(service.logOut).toEqual(jasmine.any(Function));
    });

    it("should define a method refreshToken", () => {
      expect(service.refreshToken).toBeDefined();
      expect(service.refreshToken).toEqual(jasmine.any(Function));
    });

    it("should define a method isAuthenticationRequest", () => {
      expect(service.isAuthenticationRequest).toBeDefined();
      expect(service.isAuthenticationRequest).toEqual(jasmine.any(Function));
    });

  });

  let v5AuthenticationRefreshService: V5AuthenticationRefreshService;
  describe("when logging out", () => {
    let cookieService: CookieService;
    let locationService: LocationService;
    let viewService: ViewService;
    beforeEach(() => {

      v5AuthenticationRefreshService = TestBed.inject(V5AuthenticationRefreshService);
      spyOn(v5AuthenticationRefreshService, "refreshV5").and.callFake(() => { });
      locationService = TestBed.inject(LocationService);
      spyOnProperty(locationService, "href", "set").and.callFake(() => { });
      spyOnProperty(locationService, "origin", "get").and.callFake(() => { });

    });
    const mockAuthData = {
      "token": "myTestingToken_nt9tad9JG8kmPwcgmKDsSVm6UAEZCyH1UxjoNiw",
      "refresh_token": "myRefreshToken_ c6d0515dcf670b7a8b",
      "client": "SMG360"
    };
    describe("and cookie service does not contain authorization data", () => {
      beforeEach(() => {
        cookieService = TestBed.inject(CookieService);
        cookieService = TestBed.inject(CookieService);
        spyOn(cookieService, 'deleteCookie').and.callFake(() => { });
        spyOn(cookieService, 'getAuthToken').and.callFake(() => { return undefined });
      });

      it("should get authorization data from cookie service", () => {
        service.logOut();
        expect(cookieService.getAuthToken).toHaveBeenCalled();
      });

      it("should not attempt to remove authorization data from cookie service", () => {
        service.logOut();
        expect(cookieService.deleteCookie).not.toHaveBeenCalled();
      });
    });

    describe("and cookie service contains authorization data", () => {
      beforeEach(() => {
        cookieService = TestBed.inject(CookieService);
        spyOn(cookieService, 'getAuthToken').and.callFake(() => { return mockAuthData });
        spyOn(cookieService, 'deleteCookie').and.callFake(() => { });
      });

      it("should get authorization data from cookie service", () => {
        service.logOut();
        expect(cookieService.getAuthToken).toHaveBeenCalled();
      });

      it("should not attempt to remove authorization data from cookie service in full view mode", () => {
        viewService = TestBed.inject(ViewService);
        spyOn(viewService, "getMode").and.callFake(() => Views.Full);
        service.logOut();
        expect(cookieService.deleteCookie).toHaveBeenCalledWith("authorizationData");
      });

      it("should not attempt to remove authorization data from cookie service in embedded mode", () => {
        viewService = TestBed.inject(ViewService);
        spyOn(viewService, "getMode").and.callFake(() => Views.Embedded);

        service.logOut();
        expect(cookieService.deleteCookie).toHaveBeenCalledWith("authorizationData");
      });
    });
  });
});
