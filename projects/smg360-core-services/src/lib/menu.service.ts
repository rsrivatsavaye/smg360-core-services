import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { MenuItem } from './models/menu-items.model';
import { ViewService } from './view.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuItemMapper } from './mappers/MenuItem.mapper';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, private viewService: ViewService, private localStorageService: LocalStorageService
    ,private translationService:TranslateService) { }
  get(accountId) {
    return this.http.get<Array<MenuItem>>(`/api/menu/${accountId}`).pipe(map((results) => MenuItemMapper.map(results, this.viewService, this.localStorageService,this.translationService)));
  }

  getAdmin() {
    return this.http.get<Array<MenuItem>>('/api/menu/admin').pipe(map((results) => MenuItemMapper.map(results, this.viewService, this.localStorageService,this.translationService)));
  }

  getSocialSsoLink() {
    return this.http.get('/api/menu/socialsso');
  }
}

