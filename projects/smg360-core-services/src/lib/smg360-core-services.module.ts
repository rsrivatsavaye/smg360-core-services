import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

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
  providers:[
    {provide:Window,useValue:window}
  ]
})
export class Smg360CoreServicesModule { }
