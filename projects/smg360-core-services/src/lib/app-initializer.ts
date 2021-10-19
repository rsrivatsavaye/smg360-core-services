import { AppSettingsService } from './app-settings.service';

/**
 * Factory function to load the configuration of the application on load.
 * Should be used in an APP_INITIALIZER.
 * @param appSettings - Retrieved from the DI system. 
 * @returns a promise indicating when the settings have been loaded.  
 */
export function initializeAppSettings(appSettings: AppSettingsService) {
  // TODO: When the application is updated to Angular 12+ we can return the
  // observable instead of the promise.
  return () => appSettings.loadConfig().toPromise();
}
