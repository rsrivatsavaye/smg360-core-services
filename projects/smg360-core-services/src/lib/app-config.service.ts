import { Inject, Injectable } from '@angular/core';
import { AppSettings, Settings } from './models/app-settings.model';
import { EnvironmentType } from './enums/environment.enum';
import { PROVIDE_NAME } from './contstants/provide.constants';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  constructor(@Inject(PROVIDE_NAME.SMG360_CORE_CONFIG) private config: any) {
  }
  getConfig(environment: any, environmentType: EnvironmentType): Settings {
    if (!environment) {
      return null;
    }
    return environmentType === EnvironmentType.Production ? environment.release : environment.local;
  }
}
