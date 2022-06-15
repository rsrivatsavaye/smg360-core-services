import { Injectable } from '@angular/core';
import { CookieService as Cookie } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor(
    private cookieService: Cookie,
  ) { }

  deleteAllCookies() {
    this.cookieService.deleteAll();
  }

  deleteCookie(cookieName: string) {
    this.cookieService.delete(cookieName);
  }

  getCookie(cookieName: string) {
    const cookie = this.cookieService.get(cookieName);
    return cookie;
  }

  // getCookie(cname) {
  //   const name = `${cname}=`;
  //   const decodedCookie = decodeURIComponent(document.cookie);
  //   const ca = decodedCookie.split(';');
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0; i < ca.length; i++) {
  //     let c = ca[i];
  //     while (c.charAt(0) === ' ') {
  //       c = c.substring(1);
  //     }
  //     if (c.indexOf(name) === 0) {
  //       return c.substring(name.length, c.length);
  //     }
  //   }
  //   return '';
  // }

  getAuthToken() {
    return JSON.parse(this.getCookie('authorizationData'));
  }
}