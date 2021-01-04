import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class V5AuthenticationRefreshService {
  callback: Function;

  constructor() { }

  registerCallback(callback: Function) {
    this.callback = callback;
  };
  refreshV5(access_token) {
    if (this.callback) {
      this.callback(access_token);
    }
  }
}
