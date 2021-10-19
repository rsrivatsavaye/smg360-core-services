import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  ENVIRONMENT_SETTINGS,
  IEnvironmentSettings,
} from './contstants/provide.constants';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  private isProduction = false;
  private config: any;

  // ENVIRONMENT_SETTINGS is the environment.js file injected into the DI system. 
  // It will only be used to determine if the application is running in production mode. 
  // The HttpBackend has to be injected instead of HttpClient because
  // injecting HttpClient will cause a cyclic dependency if an intercepter is also loaded.  
  constructor(
    @Inject(ENVIRONMENT_SETTINGS) environmentSettings: IEnvironmentSettings,
    private httpBackend: HttpBackend
  ) {
    this.config = {};
    this.isProduction = environmentSettings.production ?? false;
  }

  /**
   * Load config will be called on startup and it will look for a json file along 
   * with the website contents.  The Json will contain a release and local node.  
   * The production setting from the environment file will determine which one is used. 
   * @param settingsFileName - The name or path of the file containing the settings.  Should be json format. 
   * @returns A observable that will return a single object with the contents of the settings file.  
   */
  loadConfig(settingsFileName: string = 'environment.json') {
    const client = new HttpClient(this.httpBackend);
    return client.get(settingsFileName).pipe(
      map((appSettings: {release?: any, local?: any}) => {
        return this.isProduction ? appSettings?.release : appSettings?.local;
      }),
      tap((settings) => {
        this.config = settings;
      }),
      catchError((err) => {
        // This should 'eat' errors.  If no file is found a null will be returned
        // and no error will be logged.  
        return of();
      })
    );
  }

  /**
   * 
   * @returns the application configuration cast to the desired type. 
   */
  getConfig<T>() {
    return this.config as T;
  }

  /**
   * 
   * @param key name of the setting to retrieve. 
   * @returns Get a single setting from the application configuration.  This may be a string or an object.
   */
  getSetting(key: string) {
    return this.config?.[key];
  }

  /**
   * 
   * @param key name of the setting to retrieve. 
   * @returns Get a string setting from the configuration.
   */
  getStringSetting(key: string) {
    return this.getSetting(key) as string;
  }
}
