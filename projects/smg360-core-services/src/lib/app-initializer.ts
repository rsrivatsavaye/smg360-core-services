import { AppSettingsService } from './app-settings.service';

export function initializeAppSettings(appSettings: AppSettingsService) {
    return () => appSettings.loadConfig().toPromise();
}
