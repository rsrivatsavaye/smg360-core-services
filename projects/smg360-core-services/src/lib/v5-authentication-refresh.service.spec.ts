import { TestBed } from '@angular/core/testing';

import { V5AuthenticationRefreshService } from './v5-authentication-refresh.service';

describe('V5AuthenticationRefreshServiceService', () => {
  let service: V5AuthenticationRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V5AuthenticationRefreshService);
    service.registerCallback(() => { });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fire the callback', function () {

    var testAccessToken = "test19292929";
    spyOn(service, "callback");
    service.refreshV5(testAccessToken);

    expect(service.callback).toHaveBeenCalledTimes(1);
    expect(service.callback).toHaveBeenCalledWith(testAccessToken);
  });

});
