import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class AppFeatureFlagService {
  private readonly FEATURE_NODE_NAME = 'features';

  constructor(private appConfigService: AppSettingsService) {}

  /**
   * Indicated if a feature is enabled or not.
   * @param featureName - case sensitive feature name from environment.json file
   * @returns a boolean indicating if the feature is enabled or not.
   */
  isFeatureEnabled(featureName: string): boolean {
    return this.isTrue(
      this.appConfigService.getSetting(this.FEATURE_NODE_NAME)[featureName]
    );
  }

  private isTrue(value: any) {
    if (typeof value === 'string' || value instanceof String) {
      return value.toUpperCase() === 'TRUE';
    } else if (typeof value === 'boolean') {
      return value;
    }
    return !!value;
  }
}
