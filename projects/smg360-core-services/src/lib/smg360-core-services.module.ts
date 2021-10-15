import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppSettingsService } from './app-config.service';
import { AppFeatureFlagService } from './app-feature-flag.service';
import { PROVIDE_NAME } from './contstants/provide.constants';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    TranslateModule
  ]
  ,
  exports: [
    TranslateModule
  ],
  providers: [
    AppSettingsService,
    AppFeatureFlagService,
    { provide: Window, useValue: window }
  ]
})

export class Smg360CoreServicesModule {
  static forRoot(config: any): ModuleWithProviders<Smg360CoreServicesModule> {
    return {
      ngModule: Smg360CoreServicesModule,
      providers: [AppSettingsService, { provide: PROVIDE_NAME.SMG360_CORE_CONFIG, useValue: config }]
    }
  }
}
