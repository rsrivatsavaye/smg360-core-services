import { TestBed } from '@angular/core/testing';

import { AuthTokenService } from './auth-token.service';

describe('AuthTokenService', () => {
  let service: AuthTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe("initial state", function() {
    it("should have been initialized", function() {
      expect(service).not.toBe(undefined);
    });

    it('should define a method to get access token', function () {
        expect(service.getAccessToken).toBeDefined();
        expect(service.getAccessToken).toEqual(jasmine.any(Function));
    });

    it('should define a method to get client id from token', function () {
        expect(service.getAuthClient).toBeDefined();
        expect(service.getAuthClient).toEqual(jasmine.any(Function));
    });

  });
});
