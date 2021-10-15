import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { AppSettingsService } from './app-config.service';

describe('AppSettingsService', () => {
  let service: AppSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ MockProvider(AppSettingsService)]
    });
    service = TestBed.inject(AppSettingsService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
