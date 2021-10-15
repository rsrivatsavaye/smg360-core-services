import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-config.service';
import { EnvironmentType } from './enums/environment.enum';

@Injectable({
  providedIn: 'root'
})
export class AppFeatureFlagService {
  constructor(private appConfigService: AppSettingsService) {
  }

  /**
   * Indicated if a feature is enabled or not.
   * @param featureName - case sensitive feature name from environment.json file
   * @returns a boolean indicating if the feature is enabled or not.
   */
  isFeatureEnabled(featureName: string, environmentType: EnvironmentType): boolean {
    const config = this.appConfigService.getConfig(environmentType);
    if (config) {
      const featureValue = config.features[featureName];
      if (!featureValue)
        return false;
      return featureValue === "true";
    }
    return false;
  }
}
