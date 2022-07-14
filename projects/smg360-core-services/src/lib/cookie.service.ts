import { Injectable } from '@angular/core';
import { CookieOptions, CookieService as CookieSvc } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class CookieService {
  static readonly AUTH_DATA_KEY = 'authorizationData';

  constructor(
    private cookieService: CookieSvc,
  ) { }

  deleteAllCookies() {
    this.cookieService.deleteAll();
  }

  deleteCookie(cookieName: string) {
    this.cookieService.delete(cookieName);
  }

  getAllCookies() {
    return this.cookieService.getAll();
  }

  getAuthToken() {
    return JSON.parse(this.getCookie(CookieService.AUTH_DATA_KEY));
  }

  getCookie(cookieName: string) {
    const cookie = this.cookieService.get(cookieName);
    return cookie;
  }

  setCookie(cookieName: string, cookieValue: string, cookieOptions?: CookieOptions) {
    this.cookieService.set(cookieName, cookieValue, cookieOptions);
  }
}