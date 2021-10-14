import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppFeatureFlagService } from './app-feature-flag.service';
import { AppConfigService } from './app-config.service';
import { of } from 'rxjs/internal/observable/of';

describe('AppFeatureFlagService', () => {
  let appConfigService;
  let service: AppFeatureFlagService;

  beforeEach(() => {
    appConfigService = jasmine.createSpyObj('appConfigService', ['getConfig']);
    appConfigService.getConfig.and.returnValue(of({features: {}}));
    TestBed.configureTestingModule({
      providers: [
        HttpClientModule,
        { provide: AppConfigService, useValue: appConfigService }
      ]
    });
    service = TestBed.get(AppFeatureFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
