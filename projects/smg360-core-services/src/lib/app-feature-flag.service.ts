import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, pluck, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { EnvironmentType } from './enums/environment.enum';

@Injectable({
  providedIn: 'root'
})
export class AppFeatureFlagService {
  constructor(private appConfigService: AppConfigService) {
  }

  /**
   * Indicated if a feature is enabled or not.
   * @param featureName - case sensitive feature name from environment.json file
   * @returns a boolean indicating if the feature is enabled or not.
   */
  isFeatureEnabled(featureName: string, environmentContent: string, environmentType: EnvironmentType): boolean {
    const config = this.appConfigService.getConfig(environmentContent, environmentType);
    if (config) {
      const featureValue = config.features[featureName];
      if (!featureValue)
        return false;
      return featureValue === "true";
    }
    return false;
  }
}
