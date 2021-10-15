import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ENVIRONMENT_SETTINGS } from './contstants/provide.constants';



@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    TranslateModule
  ],
  exports: [
    TranslateModule
  ]
})

export class Smg360CoreServicesModule {
  static forRoot(config: any): ModuleWithProviders<Smg360CoreServicesModule> {
    return {
      ngModule: Smg360CoreServicesModule,
      providers: [
        { provide: Window, useValue: window },
        { provide: ENVIRONMENT_SETTINGS, useValue: config }
      ]
    };
  }
}
