import { Injectable } from '@angular/core';
import { AppSettings, Settings } from './models/app-settings.model';
import { EnvironmentType } from './enums/environment.enum';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  getConfig(environmentContent: string, environmentType: EnvironmentType): Settings {
    if (!environmentContent) {
      return null;
    }
    const jsonValues = JSON.parse(environmentContent) as AppSettings;
    return environmentType === EnvironmentType.Production ? jsonValues.release : jsonValues.local;
  }
}
