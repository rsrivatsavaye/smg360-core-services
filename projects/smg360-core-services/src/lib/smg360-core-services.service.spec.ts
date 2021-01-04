import { TestBed } from '@angular/core/testing';

import { Smg360CoreServicesService } from './smg360-core-services.service';

describe('Smg360CoreServicesService', () => {
  let service: Smg360CoreServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Smg360CoreServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
