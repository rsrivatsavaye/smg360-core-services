import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AppSettingsService } from './app-settings.service';
import { ENVIRONMENT_SETTINGS } from '../public-api';

describe('AppSettingsService', () => {
  let service: AppSettingsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppSettingsService,
        { provide: ENVIRONMENT_SETTINGS, useValue: { production: true } },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AppSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request the correct settings', () => {
    const settingsFile = {
      release: { value: 'release' },
      local: { value: 'local' },
    };
    let result = '';

    service.loadConfig().subscribe((settings) => {
      result = settings.value;
    });

    const req = httpMock.expectOne('environment.json', 'Requesting Config');
    req.flush(settingsFile);
    httpMock.verify();

    expect(result).toEqual('release');
  });

  it('should return the configuration', () => {
    const settingsFile = {
      release: { value: 'release' },
      local: { value: 'local' },
    };

    service.loadConfig().subscribe();

    const req = httpMock.expectOne('environment.json', 'Requesting Config');
    req.flush(settingsFile);
    httpMock.verify();

    const result = service.getConfig<{ value: string }>();
    expect(result.value).toEqual('release');
    expect(service.getSetting('value')).toEqual('release');
    expect(service.getStringSetting('value')).toEqual('release');
  });
});
