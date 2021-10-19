import { InjectionToken } from '@angular/core';

export interface IEnvironmentSettings {
  production: boolean;
}

export const ENVIRONMENT_SETTINGS = new InjectionToken<IEnvironmentSettings>(
  'Environment Settings'
);
export const WINDOW_INJECTOR = new InjectionToken<Window>('Window');
