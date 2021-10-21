import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ENVIRONMENT_SETTINGS } from './contstants/provide.constants';
import { Smg360CoreServicesComponent } from './smg360-core-services.component';



@NgModule({
  declarations: [
    Smg360CoreServicesComponent
  ],
  imports: [
    HttpClientModule,
    TranslateModule
  ],
  exports: [
    Smg360CoreServicesComponent,
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
