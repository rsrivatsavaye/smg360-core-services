import { Inject, Injectable } from '@angular/core';
import { AppSettings, Settings } from './models/app-settings.model';
import { EnvironmentType } from './enums/environment.enum';
import { PROVIDE_NAME } from './contstants/provide.constants';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  constructor(@Inject(PROVIDE_NAME.SMG360_CORE_CONFIG) private environment: any) {
  }
  getConfig(environmentType: EnvironmentType): Settings {
    if (!this.environment) {
      return null;
    }
    return environmentType === EnvironmentType.Production ? this.environment.release : this.environment.local;
  }
}
