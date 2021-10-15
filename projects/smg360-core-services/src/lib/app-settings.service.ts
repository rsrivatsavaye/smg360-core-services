import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ENVIRONMENT_SETTINGS } from './contstants/provide.constants';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private isProduction = false;
  private config: any;

  constructor(@Inject(ENVIRONMENT_SETTINGS) environmentSettings: any, private httpBackend: HttpBackend) {
    this.config = {};
    this.isProduction = environmentSettings.production ?? false;
  }

  loadConfig(settingsFileName: string = 'environment.json') {
    const client = new HttpClient(this.httpBackend);
    return client.get(settingsFileName)
      .pipe(
        map((appSettings: any) => {
          return this.isProduction ? appSettings?.release : appSettings?.local;
        }),
        tap(settings => {
          this.config = settings;
        }),
        catchError(err => {
          return of();
        })
      );
  }

  getConfig<T>(){
    return this.config as T;
  }

  getSetting(key: string){
    return this.config?.[key];
  }

  getStringSetting(key: string) {
    return this.getSetting(key) as string;
  }

}
