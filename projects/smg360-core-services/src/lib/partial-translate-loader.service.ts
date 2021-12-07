import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { map } from 'rxjs/internal/operators/map';
import { SessionCacheService } from './cache/session-cache.service';

@Injectable({
  providedIn: 'root'
})
export class PartialTranslateLoaderService {

  language:string;
  constructor(private http:HttpClient,private translate:TranslateService, private sessionCacheService: SessionCacheService){
     // TECH DEBT: This check is for backwards compatability, fix me once there are no `ls.` references in consuming apps.
    this.language = localStorage.getItem('languageIso') ?? localStorage.getItem('ls.languageIso') ?? translate.getBrowserCultureLang();

     if(this.language){
      this.language = this.language.replace(/"/g,"");
     }

     this.translate.use(this.language);
  }

  addPart(url: string) {
    if(this.language){
      this.language = this.language.replace(/"/g,"");
     }
     let extender = "?";
     if(url.includes("?"))
     {
       extender = "&"
     }

    const request$ = this.http.get(`${url + extender}language=${this.language}`);

    return SessionCacheService.cacheRequest(
      () => request$,
      this.sessionCacheService,
      url,
      'translate-add-part-'
    ).pipe(map(results => {
      this.translate.setTranslation(this.language, results, true);
      return results;
    }));
  }

}
