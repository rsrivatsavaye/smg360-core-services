import { AppFeatureFlagService } from './app-feature-flag.service';
import { AppSettingsService } from './app-settings.service';

describe('AppFeatureFlagService', () => {
  let appConfigService: jasmine.SpyObj<AppSettingsService>;
  let service: AppFeatureFlagService;

  beforeEach(() => {
    appConfigService = jasmine.createSpyObj('AppSettingsService', [
      'getSetting',
    ]);
    service = new AppFeatureFlagService(appConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get features from false strings', () => {
    appConfigService.getSetting.and.returnValue({ somefeature: 'false' });
    expect(service.isFeatureEnabled('somefeature')).toBe(false);
    expect(appConfigService.getSetting).toHaveBeenCalledWith('features');
  });

  it('should get features from true strings', () => {
    appConfigService.getSetting.and.returnValue({ somefeature: 'trUe' });
    expect(service.isFeatureEnabled('somefeature')).toBe(true);
  });

  it('should get features from false bools', () => {
    appConfigService.getSetting.and.returnValue({ somefeature: false });
    expect(service.isFeatureEnabled('somefeature')).toBe(false);
  });

  it('should get features from true bools', () => {
    appConfigService.getSetting.and.returnValue({ somefeature: true });
    expect(service.isFeatureEnabled('somefeature')).toBe(true);
  });

  it('should get features from false objects', () => {
    appConfigService.getSetting.and.returnValue({ somefeature: null });
    expect(service.isFeatureEnabled('somefeature')).toBe(false);
  });

  it('should get features from true objects', () => {
    appConfigService.getSetting.and.returnValue({ somefeature: {} });
    expect(service.isFeatureEnabled('somefeature')).toBe(true);
  });
});
