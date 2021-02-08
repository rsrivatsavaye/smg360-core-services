import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class PartialTranslateLoaderService {

  language:string;
  constructor(private http:HttpClient,private translate:TranslateService){
     this.language = localStorage.getItem('ls.languageIso') ?? translate.getBrowserCultureLang();
     if(this.language){
      this.language = this.language.replace('"',"");
     }
     
     this.translate.use(this.language);
  }
  
  addPart(url: string) {
    if(this.language){
      this.language = this.language.replace('"',"");
     }
     return this.http.get(url+`?language=${this.language}`).pipe(map(results=>{  
      this.translate.setTranslation(this.language,results,true);
    }));
  }

}