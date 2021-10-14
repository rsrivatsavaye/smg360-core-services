import { TestBed } from '@angular/core/testing';

import { AppConfigService } from './app-config.service';
import { HttpClient } from '@angular/common/http';

describe('AppConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: HttpClient, useValue: {} }]
  }));

  it('should be created', () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    expect(service).toBeTruthy();
  });
});
