import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ MockProvider(AppConfigService)]
    });
    service = TestBed.inject(AppConfigService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
